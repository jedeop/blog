use std::convert::TryInto;

use askama::Template;
use sqlx::types::Uuid;
use tide::{http::mime, Body, Request, Response, StatusCode};
use tiny_skia::Pixmap;
use usvg::SystemFontDB;

use crate::{model::post::Post, utils, Context};

#[derive(Template)]
#[template(path = "post_thumb.xml")]
struct PostThumbnailTemplate {
    title: Vec<String>,
    summary: Vec<String>,
    tags: Vec<String>,
    date: String,
    read_time: i32,
}

pub struct Thumbnail(Pixmap);

fn slipt_text(text: &str, count: u64) -> Vec<String> {
    let max = text.len() / count as usize;
    let words = text.split_whitespace();

    let mut result = Vec::new();

    let mut line = String::new();
    for word in words {
        line.push_str(word);
        line.push(' ');
        if line.len() >= max {
            result.push(line.clone().trim().to_owned());
            line.clear();
        }
    }
    result.push(line.trim().to_owned());

    result.into_iter().filter(|line| !line.is_empty()).collect()
}

impl Thumbnail {
    pub fn new(
        title: &str,
        summary: Option<&str>,
        tags: Vec<String>,
        date: String,
        read_time: i32,
    ) -> anyhow::Result<Self> {
        let thumb = PostThumbnailTemplate {
            title: slipt_text(title, 2),
            summary: slipt_text(summary.unwrap_or(""), 2),
            tags,
            date,
            read_time,
        };

        let svg = thumb.render()?;

        let mut opt = usvg::Options {
            font_family: "IBM Plex Sans KR".to_string(),
            ..Default::default()
        };
        opt.fontdb.load_system_fonts();
        opt.fontdb.set_generic_families();

        let rtree = usvg::Tree::from_str(&svg, &opt)?;

        let pixmap_size = rtree.svg_node().size.to_screen_size();
        let mut pixmap = tiny_skia::Pixmap::new(pixmap_size.width(), pixmap_size.height())
            .ok_or_else(|| anyhow::anyhow!("Cannot create Pixmap"))?;
        resvg::render(&rtree, usvg::FitTo::Original, pixmap.as_mut());

        Ok(Self(pixmap))
    }

    pub fn get_png(&self) -> anyhow::Result<Vec<u8>> {
        Ok(self.0.encode_png()?)
    }

    pub async fn route(req: Request<Context>) -> tide::Result {
        let post_id = Uuid::parse_str(req.param("post_id")?)?;

        let post = req.state().db.get_post_by_id(post_id).await?;

        let Post {
            title,
            summary,
            tags,
            created_at,
            contents,
            ..
        } = post;

        let tags = match tags {
            Some(tags) => req
                .state()
                .db
                .get_tags(&tags)
                .await?
                .into_iter()
                .map(|tag| tag.name)
                .collect(),
            None => Vec::new(),
        };
        let date = created_at.format("%Y.%m.%d").to_string();
        let read_time = utils::get_read_time(&contents).try_into()?;

        let image = Self::new(&title[..], summary.as_deref(), tags, date, read_time)?;

        let mut res = Response::new(StatusCode::Ok);

        res.set_content_type(mime::PNG);

        res.set_body(Body::from_bytes(image.get_png()?));

        Ok(res)
    }
}
