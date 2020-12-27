use askama::Template;
use usvg::SystemFontDB;

#[derive(Template)]
#[template(path = "post_thumb.xml")]
struct PostThumbTemplate {
    title: Vec<String>,
    summary: Vec<String>,
    tags: Vec<String>,
    date: String,
    read_time: i32,
}

fn slipt_text(text: &str, count: u64) -> Vec<String> {
    let max = text.len() / count as usize;
    let words = text.split_whitespace();
    
    let mut result = Vec::new();

    let mut line = String::new();
    for word in words {
        line.push_str(word);
        line.push_str(" ");
        if line.len() >= max {
            result.push(line.clone().trim().to_owned());
            line.clear();
        }
    };
    result.push(line.trim().to_owned());
    
    let result = result.into_iter().filter(|line| !line.is_empty()).collect();

    result
}

pub fn new(title: &str, summary: Option<&str>, tags: Vec<String>, date: String, read_time: i32) -> anyhow::Result<resvg::Image> {
    let thumb = PostThumbTemplate {
        title: slipt_text(title, 2),
        summary: slipt_text(summary.unwrap_or(""), 2),
        tags,
        date,
        read_time,
    };
    
    let svg = thumb.render().unwrap();
    
    let mut opt = usvg::Options::default();
    opt.font_family = "IBM Plex Sans KR".to_string();
    opt.fontdb.load_system_fonts();

    let rtree = usvg::Tree::from_str(&svg, &opt).unwrap();

    let img = resvg::render(&rtree, usvg::FitTo::Original, None).unwrap();

    Ok(img)
}