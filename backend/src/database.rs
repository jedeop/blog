use anyhow::Result;
use chrono::FixedOffset;
use sqlx::{types::Uuid, PgPool, Row};

use crate::model::{
    post::{Post, PostInput},
    series::{Series, SeriesInput},
    tag::Tag,
    user::User,
};
use crate::utils;

pub struct Database {
    pool: PgPool,
}

impl Database {
    pub async fn new(uri: &str) -> Result<Database> {
        let pool = PgPool::connect(uri).await?;
        Ok(Database { pool })
    }
}

impl Database {
    pub async fn get_post_by_id(&self, post_id: Uuid) -> Result<Post> {
        let post: Post = sqlx::query_as::<_, Post>("SELECT * FROM post WHERE post_id = $1")
            .bind(post_id)
            .fetch_one(&self.pool)
            .await?;

        Ok(post)
    }
    pub async fn get_posts_by_series(&self, series_id: Uuid) -> Result<Vec<Post>> {
        let posts: Vec<Post> = sqlx::query_as::<_, Post>("SELECT * FROM post WHERE series_id = $1")
            .bind(series_id)
            .fetch_all(&self.pool)
            .await?;
        Ok(posts)
    }
    pub async fn get_posts(
        &self,
        first: u32,
        after: chrono::DateTime<FixedOffset>,
    ) -> Result<Vec<Post>> {
        let posts: Vec<Post> = sqlx::query_as::<_, Post>(
            "SELECT *
            FROM post
            WHERE created_at > $1
            ORDER BY created_at ASC
            LIMIT $2",
        )
        .bind(after)
        .bind(first + 1)
        .fetch_all(&self.pool)
        .await?;

        Ok(posts)
    }
    pub async fn create_post(&self, post: PostInput) -> Result<Post> {
        let tag_ids: Option<Vec<Uuid>> = match &post.tags {
            Some(tags) => Some(
                self.create_tags(tags)
                    .await?
                    .into_iter()
                    .map(|tag| tag.tag_id)
                    .collect(),
            ),
            None => None,
        };
        let new_post: Post = sqlx::query_as::<_, Post>(
            "INSERT INTO
            post (title, summary, contents, tags, series_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *",
        )
        .bind(post.title)
        .bind(post.summary)
        .bind(post.contents)
        .bind(tag_ids)
        .bind(post.series_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(new_post)
    }
}

impl Database {
    pub async fn get_series_by_id(&self, series_id: Uuid) -> Result<Series> {
        let post_group: Series = sqlx::query_as::<_, Series>(
            "SELECT
            series_id, title, summary, created_at, last_update
            FROM series
            WHERE series_id = $1",
        )
        .bind(series_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(post_group)
    }

    pub async fn get_series_count(&self, series_id: Uuid) -> Result<i64> {
        let count = sqlx::query("SELECT count(*) AS count FROM post WHERE series_id = $1")
            .bind(series_id)
            .fetch_one(&self.pool)
            .await?;

        let count = count.try_get("count")?;

        Ok(count)
    }

    pub async fn get_read_time_avg(&self, series_id: Uuid) -> Result<usize> {
        let posts = self.get_posts_by_series(series_id).await?;

        let len = posts.len();

        if len == 0 {
            return Ok(0);
        }

        let total_time: usize = posts
            .iter()
            .map(|post| utils::get_read_time(&post.contents))
            .sum();

        let avg = total_time / len;

        Ok(avg)
    }

    pub async fn create_series(&self, series: SeriesInput) -> Result<Series> {
        let new_series: Series = sqlx::query_as::<_, Series>(
            "INSERT INTO series (title, summary)
            VALUES ($1, $2)
            RETURNING *",
        )
        .bind(series.title)
        .bind(series.summary)
        .fetch_one(&self.pool)
        .await?;

        Ok(new_series)
    }
}

impl Database {
    pub async fn get_tags(&self, tag_ids: &[Uuid]) -> Result<Vec<Tag>> {
        let tags: Vec<Tag> = sqlx::query_as::<_, Tag>(
            "SELECT tag_id, name
            FROM tag
            WHERE tag_id IN (SELECT * FROM UNNEST($1))",
        )
        .bind(tag_ids)
        .fetch_all(&self.pool)
        .await?;

        Ok(tags)
    }
    pub async fn create_tags(&self, tags: &[String]) -> Result<Vec<Tag>> {
        let tags: Vec<Tag> = sqlx::query_as::<_, Tag>(
            "INSERT INTO tag (name)
            SELECT * FROM UNNEST($1)
            ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name
            RETURNING *;",
        )
        .bind(tags)
        .fetch_all(&self.pool)
        .await?;

        Ok(tags)
    }
}

impl Database {
    pub async fn create_user(&self, user: &User) -> Result<User> {
        let user: User = sqlx::query_as::<_, User>(
            "INSERT INTO users(user_id, name, avatar_url)
            VALUES ($1, $2, $3)
            RETURNING *;",
        )
        .bind(&user.user_id)
        .bind(&user.name)
        .bind(&user.avatar_url)
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }
    pub async fn get_user_if_exist(&self, user_id: &str) -> Result<Option<User>> {
        let user: Option<User> = sqlx::query_as::<_, User>(
            "SELECT * FROM users
            WHERE user_id = $1",
        )
        .bind(user_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(user)
    }
    pub async fn update_user(&self, user_id: &str, name: &str, avatar_url: &str) -> Result<User> {
        let user: User = sqlx::query_as::<_, User>(
            "UPDATE users
            SET name = $1,
                avatar_url = $2
            WHERE user_id = $3
            RETURNING *;",
        )
        .bind(name)
        .bind(avatar_url)
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }
}
