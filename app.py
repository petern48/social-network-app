from flask import Flask, render_template, request, redirect, session, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3 as sql
from os import path
from flask_cors import CORS
from helpers import error,  get_posts, login_required, executeDB
from helpers import create_post, create_comment, get_comments


app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Protect Security
CORS(app)


@app.route("/follow-user/<int:id>", methods=["GET", "POST"])
@login_required
def follow(id):
    
    if request.method == "GET":
        return redirect(request.url)
    
    if request.method == "POST":
        user_id = session["user_id"]
        
        followed = executeDB("SELECT * FROM followers WHERE user_id=? AND following_id=?", [user_id, id])
        if not followed:
            change = 1
            executeDB("INSERT INTO followers (user_id, following_id) VALUES (?, ?)", [user_id, id])
        else:
            change = -1
            executeDB("DELETE FROM followers WHERE user_id=? AND following_id=?", [user_id, id])

        executeDB("UPDATE users SET followers = (followers + ?) WHERE id=?", [change, user_id])
        followers = executeDB("SELECT followers FROM users WHERE id=?", [user_id])
        
        # Return to JS file as JSON
        return jsonify({"followers": followers[0][0], "user_id": user_id, "change":change })


@app.route("/comment-post/<int:id>", methods=["GET", "POST"])
@login_required
def comment(id):
    if request.method == "GET":
        return redirect("/")
    
    if request.method == "POST":
        content = request.form.get("comment")
        print(content)
        if content:
            print("AAAAAAAAA")
            create_comment(content, id)
        
        return redirect(request.url)


@app.route("/like-post/<int:id>", methods=["GET", "POST"])
@login_required
def like(id):
    
    if request.method == "GET":
        return redirect("/")
    
    if request.method == "POST":
        user_id = session["user_id"]
        liked = executeDB("SELECT * FROM likes WHERE user_id=? AND post_id=?", [user_id, id])
        if not liked:
            change = 1
            executeDB("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [user_id, id])
        else:
            change = -1
            executeDB("DELETE FROM likes WHERE user_id=? AND post_id=?", [user_id, id])

        executeDB("UPDATE posts SET likes = (likes + ?) WHERE id=?", [change, id])
        likes = executeDB("SELECT likes FROM posts WHERE id=?", [id])
        
        # Return to JS file as JSON
        return jsonify({"likes": likes[0][0], "user_id": user_id, "change":change })
        
    

@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    """Display profile for a user"""
    
    # Render profile for the user that's logged in
    if request.method == "GET":
        user_id = session["user_id"]
    
    # Render another user's profile
    if request.method == "POST":
        user_id = request.form.get("user_id")
    
    user = executeDB("SELECT * FROM users WHERE id=?", [user_id])
    
    posts = get_posts(user_id)
    
    return render_template("profile.html", user=user[0], posts=posts)


@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    """Displays Homepage and create posts"""
    
    if request.method == "GET":
        pass
    
    if request.method == "POST":
        content = request.form.get("content")
        if content:
            create_post(content)
            
    # Gets all posts and comments from all users
    posts = get_posts()
    comments = get_comments()
    
    return render_template("index.html", posts=posts, comments=comments)


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register User"""
    
    # Forget any user_id
    session.clear()
    
    if request.method == "GET":
        return render_template("register.html")

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        # Require user inputs a username
        if not username:
            return error("must provide username")
        if not password:
            return error("must provide password")
        if password != confirmation:
            return error("password and confirmation do not match")

        # Require the username is different
        usernames = executeDB("SELECT username FROM users WHERE username=?", [username])
        
        if usernames != []:
            return error("username is already taken")

        # Require password to have at least 7 letters,
        hasdigit = False
        hasupper = False
        haslower = False

        for char in password:
            if char.isdigit():
                hasdigit = True
            if char.isupper():
                hasupper = True
            if char.islower():
                haslower = True

        if len(password) < 7 or hasdigit == False or hasupper == False or haslower == False:
            return error("must have at least 7 chararacters, 1 number, 1 uppercase letter, and 1 lowercase letter")

        # Generate a password hash
        hash = generate_password_hash(password, method='pbkdf2:sha1', salt_length=8)

        # Insert the new user into users
        executeDB("INSERT INTO users(username, hash) VALUES(?, ?)", [username, hash])
        
        # Return to login page once registered
        return redirect("/login")
    
    
@app.route('/login', methods=["GET","POST"])
def login():
    """Login User"""
    
    # Forget any user id
    session.clear()
    
    if request.method == "GET":
        return render_template("login.html")
    
    if request.method == "POST":
        
        if not request.form.get("username"):
            return error("Must provide username")
        if not request.form.get("password"):
            return error("Must provide password")
        
        rows = executeDB("SELECT * FROM users WHERE username = ?", [request.form.get("username")])

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return error("Invalid username and/or password")
        
        if rows:
            # Remember which user has logged in
            session["user_id"] = rows[0]["id"]
            session["username"] = request.form.get("username")

        # Redirect user to home page
        return redirect("/")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)