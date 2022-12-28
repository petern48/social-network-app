from flask import Flask, render_template, request, redirect, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3 as sql
from os import path
from flask_cors import CORS
from helpers import error, create_post, get_posts, login_required, connectDB


app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Protect Security
CORS(app)


@app.route("/like", methods=["GET", "POST"])
@login_required
def like():
    
    if request.method == "GET":
        return redirect("/")
    
    if request.method == "POST":
        postID = request.form.get("postid")
        conn = connectDB()
        cur = conn.cursor()
        cur.execute("UPDATE posts SET likes = (likes + 1) WHERE id=?", [postID])
        
        conn.commit()
        conn.close()
        
        # Return to same page
        return redirect(request.url)
        
    

@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    
    # Render profile for the user that's logged in
    if request.method == "GET":
        user_id = session["user_id"]
    
    # Render another user's profile
    if request.method == "POST":
        user_id = request.form.get("user_id")
        
        
    conn = connectDB()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id=?", [user_id])
    user = cur.fetchall()
    
    conn.commit()
    conn.close()
    
    posts = get_posts(user_id)
    
    return render_template("profile.html", user=user[0], posts=posts)


@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    
    if request.method == "GET":
        pass
    
    if request.method == "POST":
        content = request.form.get("content")
        if content:
            create_post(content)
            
        posts = get_posts()
        
    # Gets all posts from all users
    posts = get_posts()
    
    return render_template("index.html", posts=posts)


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

        conn = connectDB()
        cur = conn.cursor()

        # Require the username is different
        cur.execute("SELECT username FROM users WHERE username=?", [username])
        usernames = cur.fetchall()
        
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
        cur.execute("INSERT INTO users(username, hash) VALUES(?, ?)", [username, hash])

        conn.commit()
        conn.close()
        
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
        
        conn = connectDB()
        cur = conn.cursor()
        
        cur.execute("SELECT * FROM users WHERE username = ?", [request.form.get("username")])
        rows = cur.fetchall()
        
        conn.commit()
        conn.close()

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