CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_update = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS series (
  series_id UUID DEFAULT uuid_generate_v4(),
  title VARCHAR(50) NOT NULL,
  summary VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_update TIMESTAMPTZ,
  PRIMARY KEY(series_id)
);

CREATE TRIGGER update_timestamp
BEFORE UPDATE ON series
FOR EACH ROW
EXECUTE PROCEDURE trigger_update_timestamp();

CREATE TABLE IF NOT EXISTS tag (
  tag_id UUID DEFAULT uuid_generate_v4(),
  name VARCHAR(25) NOT NULL UNIQUE,
  PRIMARY KEY(tag_id)
);

CREATE TABLE IF NOT EXISTS post (
  post_id UUID DEFAULT uuid_generate_v4(),
  title VARCHAR(50) NOT NULL,
  summary VARCHAR(100),
  contents TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_update TIMESTAMPTZ,
  tags UUID [],
  series_id UUID,
  FOREIGN KEY(series_id) 
    REFERENCES series(series_id)
    ON DELETE SET NULL,
  PRIMARY KEY(post_id)
);

CREATE TRIGGER update_timestamp
BEFORE UPDATE ON post
FOR EACH ROW
EXECUTE PROCEDURE trigger_update_timestamp();

CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(258) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  PRIMARY KEY(user_id)
);