use rand::{distributions::Alphanumeric, thread_rng, Rng};

// pub fn get_contents(body: &str) -> Vec<&str> {
//     body.lines()
//         .filter(|line| line.starts_with("# ") || line.starts_with("## "))
//         .collect()
// }

pub fn get_read_time(contents: &str) -> usize {
    (contents.split_whitespace().count() as f64 * 0.33 / 60.0).round() as usize
}

pub fn generate_random_str(lenght: usize) -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(lenght)
        .map(char::from)
        .collect::<String>()
}
