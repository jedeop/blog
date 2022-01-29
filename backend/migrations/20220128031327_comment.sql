CREATE TABLE IF NOT EXISTS comment (
  comment_id UUID DEFAULT uuid_generate_v4(),
  user_id VARCHAR(258) NOT NULL,
  post_id UUID NOT NULL,
  contents TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_update TIMESTAMPTZ,
  FOREIGN KEY(user_id) 
    REFERENCES users(user_id)
    ON DELETE SET NULL,
  FOREIGN KEY(post_id) 
    REFERENCES post(post_id)
    ON DELETE CASCADE,
  PRIMARY KEY(comment_id)
);

CREATE TRIGGER update_timestamp
BEFORE UPDATE ON comment
FOR EACH ROW
EXECUTE PROCEDURE trigger_update_timestamp();