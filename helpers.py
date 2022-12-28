import sqlite3 as sql
from os import path
from flask import redirect, render_template, request, session
from datetime import datetime


def executeDB(query, arg=None):
    conn = sql.connect('network.db')
    conn.row_factory = sql.Row # "dictionary cursor"
    cur = conn.cursor()
    
    # If no given arguments
    if arg == None:
        cur.execute(query)
    # If there are arguments
    else:
        cur.execute(query, arg)
    
    # Save value
    value = cur.fetchall()
    
    # Save and close
    conn.commit()
    conn.close()
    
    # Return value for cases where its needed
    return value

def error(text):
    # Displays error
    return render_template("error.html", text=text)

def create_post(content):
    """Creates a post, given a name and the content to post"""
    
    now = datetime.now()
    now = now.strftime("%m/%d/%Y, %H:%M")

    executeDB('INSERT INTO posts (user_id, name, content, datetime) values (?, ?, ?, ?)', [session["user_id"], session["username"], content, now])

    
def get_posts(user_id=None):
    """Returns all of posts. Pass in user_id to get only their posts"""
    
    # Get all posts
    if user_id == None:
        posts = executeDB("SELECT * FROM posts ORDER BY datetime DESC")
        
    # Only get user's posts
    else:
        posts = executeDB("SELECT * FROM posts WHERE user_id = ? ORDER BY datetime DESC", [user_id])
    
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