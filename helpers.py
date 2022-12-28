import sqlite3 as sql
from os import path
from flask import redirect, render_template, request, session
from datetime import datetime


def connectDB():
    conn = sql.connect('network.db')
    conn.row_factory = sql.Row # "dictionary cursor"
    return conn

def error(text):
    # Displays error
    return render_template("error.html", text=text)

def create_post(content):
    """Creates a post, given a name and the content to post"""
    
    now = datetime.now()
    now = now.strftime("%m/%d/%Y, %H:%M")

    conn = connectDB()
    cur = conn.cursor()
    cur.execute('INSERT INTO posts (user_id, name, content, datetime) values (?, ?, ?, ?)', [session["user_id"], session["username"], content, now])
    
    # Finalize database
    conn.commit()
    conn.close()

    
def get_posts(user_id=None):
    """Returns all of posts. Pass in user_id to get only their posts"""
    
    conn = connectDB()
    cur = conn.cursor()
    
    # Get all posts
    if user_id == None:
        cur.execute("SELECT * FROM posts")
    # Only get user's posts
    else:
        cur.execute("SELECT * FROM posts WHERE user_id = ?", [user_id])
        
    posts = cur.fetchall()
    
    return posts


    

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