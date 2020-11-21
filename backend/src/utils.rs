pub fn get_contents(body: &str) -> Vec<&str> {
    body.lines()
        .filter(|line| line.starts_with("# ") || line.starts_with("## "))
        .collect()
}

pub fn get_read_time(body: &str) -> i32 {
    (body.split_whitespace().count() as f64 * 0.33 / 60.0).round() as i32
}
