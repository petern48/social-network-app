import sqlite3 as sql
from os import path
from flask import redirect, render_template, request, session

# Get directory name and its path
ROOT = path.dirname(path.relpath(__file__))


def create_post(name, content):
    """Creates a post, given a name and the content to post"""
    # Make connection to database
    con = sql.connect(path.join(ROOT, 'posts.db'))
    # Create a cursor
    cur = con.cursor()
    
    # user_id = session["user_id"]
    # return error(user_id)
    cur.execute('INSERT INTO posts (user_id, name, content) values (?, ?)', [name, content])
    
    # Finalize database
    con.commit()
    con.close()

    
def get_posts():
    """Returns all posts"""
    con = sql.connect(path.join(ROOT, 'posts.db'))
    cur = con.cursor()
    cur.execute('SELECT * FROM posts')
    posts = cur.fetchall()
    return posts


def error(text):
    # Displays error
    return render_template("error.html", text=text)
    

from functools import wraps

def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function