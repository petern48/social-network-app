import sqlite3 as sql
from os import path

# Get directory name and its path
ROOT = path.dirname(path.relpath(__file__))


def create_post(name, content):
    # Make connection to database
    con = sql.connect(path.join(ROOT, 'posts.db'))
    # Create a cursor for efficiency
    cur = con.cursor()
    cur.execute('INSERT INTO posts (name, content) values (?, ?)', (name, content))
    
    # Finalize database
    con.commit()
    con.close()
    
def get_posts():
    con = sql.connect(path.join(ROOT, 'posts.db'))
    cur = con.cursor()
    cur.execute('SELECT * FROM posts')
    posts = cur.fetchall()
    return posts