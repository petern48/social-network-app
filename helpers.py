import sqlite3 as sql
from os import path
from flask import redirect, render_template, request, session


def connectDB():
    conn = sql.connect('posts.db')
    conn.row_factory = sql.Row # "dictionary cursor"
    return conn

def create_post(name, content):
    """Creates a post, given a name and the content to post"""
    
    user_id = session["user_id"]

    conn = connectDB()
    cur = conn.cursor()
    cur.execute('INSERT INTO posts (user_id, name, content) values (?, ?, ?)', [user_id, name, content])
    
    # Finalize database
    conn.commit()
    conn.close()

    
def get_posts():
    """Returns all posts"""
    
    conn = connectDB()
    cur = conn.cursor()
    cur.execute("SELECT * FROM posts WHERE user_id = ?", [session["user_id"]])
    
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