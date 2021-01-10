use tide::{Redirect, Request, Response, StatusCode};

use crate::{utils, Context};

#[derive(Clone)]
pub struct GoogleOAuth2 {
    client_id: String,
    client_secret: String,
    redirect_uri: String,
    scope: Vec<&'static str>,
}
impl GoogleOAuth2 {
    pub fn new(client_id: String, client_secret: String, base_redirect_uri: String) -> Self {
        Self {
            client_id,
            client_secret,
            redirect_uri: format!("{}/google", base_redirect_uri),
            scope: vec!["profile", "openid"],
        }
    }
    pub fn get_auth_uri(&self, state: &str) -> String {
        format!(
            "https://accounts.google.com/o/oauth2/v2/auth?client_id={}&redirect_uri={}&scope={}&include_granted_scopes=true&response_type=code&state={}",
            &self.client_id,
            &self.redirect_uri,
            &self.scope.join(" "),
            &state,
        )
    }
    pub fn get_auth_server_req<'a>(&self, code: &'a str) -> GoogleOAuth2ASReq<'a, '_> {
        GoogleOAuth2ASReq {
            code,
            client_id: &self.client_id,
            client_secret: &self.client_secret,
            redirect_uri: &self.redirect_uri,
            grant_type: "authorization_code",
        }
    }
}

    //Google OAuth2 Resource Owner Response
#[derive(serde::Deserialize)]
struct GoogleOAuth2RORes {
    code: String,
    state: String,
    scope: String,
}
    // Google OAuth2 Authorization Server Request
#[derive(serde::Serialize, Debug)]
pub struct GoogleOAuth2ASReq<'a, 'b> {
    code: &'a str,
    client_id: &'b str,
    client_secret: &'b str,
    redirect_uri: &'b str,
    grant_type: &'b str,
}
    // Google OAuth2 Authorization Server Response
#[derive(serde::Deserialize, Debug)]
pub struct GoogleOAuth2ASRes {
    access_token: String,
    expires_in: i32,
    id_token: String,
    scope: String,
    token_type: String,
}

pub async fn route(mut req: Request<Context>) -> tide::Result {
    let res = match req.query::<GoogleOAuth2RORes>() {
        Ok(code) => {
            {
                let session = req.session();
                let state = session.get::<String>("oauth2state").unwrap_or_default();
                if code.state != state {
                    let mut res = Response::new(StatusCode::BadRequest);
                    res.set_body("Invalid state");
                    return Ok(res);
                };
            }

            let oauth2 = &req.state().auth;
            let mut auth_res = surf::post("https://oauth2.googleapis.com/token")
                .body(surf::Body::from_json(
                    &oauth2.get_auth_server_req(&code.code),
                )?)
                .await?;
            
            let mut res = Response::new(StatusCode::Ok);
            res.set_body(format!("\n{:?}", auth_res.body_json::<GoogleOAuth2ASRes>().await?));

            res
        }
        Err(_) => {
            let state = utils::generate_state();
            {
                let session = req.session_mut();
                session.insert("oauth2state", &state)?;
            }
            let oauth2 = &req.state().auth;
            Redirect::new(oauth2.get_auth_uri(&state)).into()
        }
    };
    Ok(res)
}
