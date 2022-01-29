use anyhow::Result;
use chrono::FixedOffset;
use sqlx::{types::Uuid, PgPool, Row};

use crate::model::{
    comment::{Comment, CommentInput},
    post::{Post, PostInput, PostPartialInput},
    series::{Series, SeriesInput},
    tag::Tag,
    user::{User, UserInput},
};
use crate::utils;

pub struct Database {
    pool: PgPool,
}

impl Database {
    pub async fn new(uri: &str) -> Result<Database> {
        let pool = PgPool::connect(uri).await?;

        sqlx::migrate!().run(&pool).await?;

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
            WHERE created_at < $1 AND is_published
            ORDER BY created_at DESC
            LIMIT $2",
        )
        .bind(after)
        .bind(first + 1)
        .fetch_all(&self.pool)
        .await?;

        Ok(posts)
    }
    pub async fn get_posts_all(
        &self,
        first: u32,
        after: chrono::DateTime<FixedOffset>,
    ) -> Result<Vec<Post>> {
        let posts: Vec<Post> = sqlx::query_as::<_, Post>(
            "SELECT *
            FROM post
            WHERE created_at < $1
            ORDER BY created_at DESC
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
            post (title, summary, contents, tags, is_published, series_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *",
        )
        .bind(post.title)
        .bind(post.summary)
        .bind(post.contents)
        .bind(tag_ids)
        .bind(post.is_published)
        .bind(post.series_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(new_post)
    }
    pub async fn update_post(&self, post_id: Uuid, post_input: PostPartialInput) -> Result<Post> {
        let tag_ids: Option<Vec<Uuid>> = match &post_input.tags {
            Some(tags) => Some(
                self.create_tags(tags)
                    .await?
                    .into_iter()
                    .map(|tag| tag.tag_id)
                    .collect(),
            ),
            None => None,
        };
        let post: Post = sqlx::query_as::<_, Post>(
            "UPDATE post
            SET title = COALESCE($2, post.title),
                summary = COALESCE($3, post.summary),
                contents = COALESCE($4, post.contents),
                tags = COALESCE($5, post.tags),
                is_published = COALESCE($6, post.is_published),
                series_id = COALESCE($7, post.series_id)
            WHERE post_id = $1
            RETURNING *;",
        )
        .bind(&post_id)
        .bind(&post_input.title)
        .bind(&post_input.summary)
        .bind(&post_input.contents)
        .bind(&tag_ids)
        .bind(&post_input.is_published)
        .bind(&post_input.series_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(post)
    }
    pub async fn delete_post(&self, post_id: &Uuid) -> Result<()> {
        sqlx::query(
            "DELETE FROM post
            WHERE post_id = $1",
        )
        .bind(&post_id)
        .execute(&self.pool)
        .await?;

        Ok(())
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
    pub async fn create_or_update_user(&self, user: UserInput) -> Result<User> {
        let user: User = sqlx::query_as::<_, User>(
            "INSERT INTO users(user_id, name, avatar_url)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id) DO UPDATE
            SET name = COALESCE(EXCLUDED.name, users.name),
                avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url)
            RETURNING *;",
        )
        .bind(&user.user_id)
        .bind(&user.name)
        .bind(&user.avatar_url)
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }
    pub async fn get_user_by_id(&self, user_id: &str) -> Result<User> {
        let user: User = sqlx::query_as::<_, User>(
            "SELECT
            user_id, name, avatar_url
            FROM users
            WHERE user_id = $1",
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }
}

impl Database {
    pub async fn get_comment_by_id(&self, comment_id: Uuid) -> Result<Comment> {
        let comment: Comment = sqlx::query_as::<_, Comment>(
            "SELECT *
            FROM comment
            WHERE comment_id = $1",
        )
        .bind(comment_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(comment)
    }
    pub async fn get_comments_by_post(&self, post_id: Uuid) -> Result<Vec<Comment>> {
        let comment: Vec<Comment> = sqlx::query_as::<_, Comment>(
            "SELECT *
            FROM comment
            WHERE post_id = $1",
        )
        .bind(post_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(comment)
    }
    pub async fn create_comment(&self, comment: CommentInput, user_id: &str) -> Result<Comment> {
        let comment: Comment = sqlx::query_as::<_, Comment>(
            "INSERT INTO comment (user_id, post_id, contents)
            VALUES ($1, $2, $3)
            RETURNING *",
        )
        .bind(user_id)
        .bind(comment.post_id)
        .bind(comment.contents)
        .fetch_one(&self.pool)
        .await?;

        Ok(comment)
    }
}
