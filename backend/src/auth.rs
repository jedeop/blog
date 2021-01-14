use std::fmt;

use tide::{Redirect, Request, Response, StatusCode};

use crate::{
    model::user::{User, UserInput},
    utils, Context,
};

pub enum Service {
    GOOGLE,
}
impl fmt::Display for Service {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let str = match self {
            Self::GOOGLE => "GOO",
        };
        write!(f, "{}", str)
    }
}

pub mod google_oauth2 {
    use chrono::{Duration, TimeZone, Utc};
    use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, Validation};
    use serde::{Deserialize, Serialize};

    #[derive(Clone)]
    pub struct Client {
        pub client_id: String,
        client_secret: String,
        redirect_uri: String,
        scope: Vec<&'static str>,
    }
    impl Client {
        pub fn new(client_id: String, client_secret: String, base_redirect_uri: String) -> Self {
            Self {
                client_id,
                client_secret,
                redirect_uri: format!("{}/google", base_redirect_uri),
                scope: vec!["openid", "profile"],
            }
        }
        pub fn get_auth_uri(&self, state: &str, nonce: &str) -> String {
            format!(
            "https://accounts.google.com/o/oauth2/v2/auth?client_id={}&redirect_uri={}&scope={}&include_granted_scopes=true&response_type=code&state={}&nonce={}",
            &self.client_id,
            &self.redirect_uri,
            &self.scope.join(" "),
            &state,
            &nonce,
        )
        }
        pub fn get_token_req<'a>(&self, code: &'a str) -> TokenReq<'a, '_> {
            TokenReq {
                code,
                client_id: &self.client_id,
                client_secret: &self.client_secret,
                redirect_uri: &self.redirect_uri,
                grant_type: "authorization_code",
            }
        }
        pub async fn req_token(&self, code: &str) -> Result<TokenRes, tide::Error> {
            let mut token_res = surf::post("https://oauth2.googleapis.com/token")
                .body(surf::Body::from_json(&self.get_token_req(&code))?)
                .await?;
            token_res.body_json::<TokenRes>().await
        }
        pub async fn decode_id_token(
            &self,
            encoded_id_token: &str,
            nonce: &str,
        ) -> Result<IDTokenClaims, tide::Error> {
            let header = decode_header(&encoded_id_token)?;
            // TODO: #13 Cache certs
            let IDTokenCerts { keys: certs } =
                surf::get("https://www.googleapis.com/oauth2/v3/certs")
                    .recv_json::<IDTokenCerts>()
                    .await?;

            let kid = header.kid.unwrap_or_default();
            let cert = certs
                .iter()
                .find(|cert| cert.kid == kid)
                .ok_or_else(|| anyhow::anyhow!("id token cert is wrong"))?;

            let token = decode::<IDTokenClaims>(
                encoded_id_token,
                &DecodingKey::from_rsa_components(&cert.n, &cert.e),
                &Validation::new(Algorithm::RS256),
            )?;

            let token = token.claims;

            token.verify(&self.client_id, &nonce)?;

            Ok(token)
        }
    }

    #[derive(Deserialize)]
    pub struct AuthRes {
        pub code: String,
        pub state: String,
        pub scope: String,
    }
    #[derive(Serialize)]
    pub struct TokenReq<'a, 'b> {
        code: &'a str,
        client_id: &'b str,
        client_secret: &'b str,
        redirect_uri: &'b str,
        grant_type: &'b str,
    }
    #[derive(Deserialize)]
    pub struct TokenRes {
        // expires_in: u64,
        pub id_token: String,
        // scope: String,
        // token_type: String,
    }

    #[derive(Deserialize)]
    pub struct IDTokenClaims {
        pub aud: String,
        pub exp: i64,
        pub iat: u64,
        pub iss: String,
        pub sub: String,
        pub name: Option<String>,
        pub picture: Option<String>,
        pub nonce: String,
    }
    impl IDTokenClaims {
        pub fn verify(&self, client_id: &str, nonce: &str) -> Result<(), anyhow::Error> {
            if self.iss != "https://accounts.google.com" && self.iss != "accounts.google.com" {
                return Err(anyhow::anyhow!("Wrong iss: {}", &self.iss));
            };
            if self.aud != client_id {
                return Err(anyhow::anyhow!("Wrong aud: {}", &self.aud));
            };
            if self.nonce != nonce {
                return Err(anyhow::anyhow!(
                    "Wrong nonce\nfrom token: {}\nfrom session: {}",
                    &self.nonce,
                    &nonce
                ));
            };
            let exp = Utc.timestamp(self.exp, 0);
            if exp - Utc::now() < Duration::zero() {
                return Err(anyhow::anyhow!("Token has expired"));
            };
            Ok(())
        }
    }

    #[derive(Deserialize)]
    pub struct IDTokenCert {
        n: String,
        e: String,
        kid: String,
    }
    #[derive(Deserialize)]
    pub struct IDTokenCerts {
        keys: Vec<IDTokenCert>,
    }
}

pub async fn route(mut req: Request<Context>) -> tide::Result {
    let res = match req.query::<google_oauth2::AuthRes>() {
        Ok(auth_res) => {
            let session = req.session();
            let state = session.get::<String>("oauth2_state").unwrap_or_default();
            if auth_res.state != state {
                let mut res = Response::new(StatusCode::BadRequest);
                res.set_body("Invalid state");
                return Ok(res);
            };

            let client = &req.state().auth;
            let token_res = client.req_token(&auth_res.code).await?;

            let nonce = session.get::<String>("openid_nonce").unwrap_or_default();
            let token = client.decode_id_token(&token_res.id_token, &nonce).await?;

            let db = &req.state().db;
            let user_input = UserInput::new(Service::GOOGLE, token.sub, token.name, token.picture);
            let user: User = db.create_or_update_user(user_input).await?;

            let session = req.session_mut();
            session.remove("oauth2_state");
            session.remove("openid_nonce");
            session.insert("user", &user)?;

            Redirect::new("/").into()
        }
        Err(_) => {
            let state = utils::generate_random_str(50);
            let nonce = utils::generate_random_str(50);
            {
                let session = req.session_mut();
                session.insert("oauth2_state", &state)?;
                session.insert("openid_nonce", &nonce)?;
            }
            let oauth2 = &req.state().auth;
            Redirect::new(oauth2.get_auth_uri(&state, &nonce)).into()
        }
    };
    Ok(res)
}
