--sqlite3 network.db < schema.sql

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username TEXT NOT NULL,
    hash TEXT NOT NULL,
    followers INTEGER DEFAULT 0 NOT NULL
);

DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,  -- NOT CHANGED YET. STILL IS "name"
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    datetime NUMERIC NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX username on users (username);