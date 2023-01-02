/*
// Array to hold all posts
allPosts = [];


class Post {
    constructor(postId) {
        this.id = postId;
        this.likes = 0;
        this.comments = [];
        this.nComments = 0;
        allPosts.push(this); // Save this post to allPosts
    }

    addLike() {
        this.likes++;
        return true;
    }

    removeLike() {
        if (this.likes > 0) {
            this.likes--;
            return true;
        }
        else {
            return false
        }

    }
    addComment(text) {
        this.comments.push(text)
        this.nComments;
    }

    getComments() {
        return this.comments;
    }


};


function findPost(postId) {
    for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].id === postId) {
            return allPosts[i];
        }
    }
    return null;

function createPosts() {
    document.querySelectorAll(".like").forEach(function(element) {

        const postId = element.getAttribute("name");
        let post = new Post(postId);
    });
}
}*/

function clearChildren(parent) {
    while (parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

function toggleCommentBox(postId, option) {
    if (option == "open") {
        document.querySelector(`#comment-input${postId}`).style.display = "block";
    }
    else {
        document.querySelector(`#comment-input${postId}`).style.display = "none";
    }
}

function setInitialValues() {
    // Set like button as "Like" or "Unlike"
    document.querySelectorAll(".like").forEach(function(button) {
        const INDEXOFIDVALUE = 11;
        post_id = button.id.slice(INDEXOFIDVALUE);
        
        fetch(`/like-post/${post_id}`, {method:"GET"})
        .then((response) => response.json())
        .then((data) => { 
            // Not liked yet
            if (data["change"] == 1) {
                button.innerHTML = "Like";
            // Already Liked
            } else {
                button.innerHTML = "Unlike";
            }
        })
        .catch((error) => console.log(error));
    })
    // Set follow button as "Follow" or "Unfollow"
    document.querySelectorAll(".follow").forEach(function(button) {
        const INDEXOFIDVALUE = 13;
        post_id = button.id.slice(INDEXOFIDVALUE);
        
        fetch(`/follow-user/${post_id}`, {method:"GET"})
        .then((response) => response.json())
        .then((data) => { 
            // Not followed yet
            if (data["change"] == 1) {
                button.innerHTML = "Follow";
            // Already followed
            } else {
                button.innerHTML = "Unfollow";
            }
        })
        .catch((error) => console.log(error));
    })

    // Display delete button for user's own post. 
    // Note: There is additional backend protection from deleting other user's posts
    document.querySelectorAll("button.delete").forEach(function(button) {
        const INDEXOFIDVALUE = 13;
        post_id = button.id.slice(INDEXOFIDVALUE);
        
        fetch(`/delete-post/${post_id}`, {method:"GET"})
        .then((response) => response.json())
        .then((data) => { 
            // Display delete button, valid user
            if (data["valid"] == true) {
                button.style.display = "block";
            }
        })
        .catch((error) => console.log(error));
    })
}

document.addEventListener("DOMContentLoaded", function() {
    
    // createPosts();
    
    commentFeature();
    
    setInitialValues();
});

// Like and Unlike Feature
function likeFeature(postId) {
    const button = document.querySelector(`#like-button${postId}`);
    const count = document.querySelector(`#like-count${postId}`);
    
    fetch(`/like-post/${postId}`, { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
        count.innerHTML = data["likes"] + " likes";
        if (data["change"] == 1) {
            button.innerHTML = "Unlike";
        }
        else {
            button.innerHTML = "Like";
        }
    })
    .catch((error) => console.log(error));
}

// Follow and Unfollow Feature
function followFeature(following_id) {
    const button = document.querySelector(`#follow-button${following_id}`);
    const count = document.querySelector(`#follow-count${following_id}`);
    
    fetch(`/follow-user/${following_id}`, {method: "POST"})
    .then((response) => response.json())
    .then((data) => {
        count.innerHTML = `Followers: ${data["followers"]}`;
        if (data["change"] == 1) {
            button.innerHTML = "Unfollow";
        }
        else {
            button.innerHTML = "Follow";
        }
    })
    .catch((error) => console.log(error));
}

function deleteFeature(post_id) {
    const button = document.querySelector(`#delete-button${post_id}`);
    const post = document.querySelector(`div#post${post_id}`);
    
    // Set button text to "Confirm?"
    if (button.innerHTML == "Delete Post") {
        button.innerHTML = "Confirm Delete?";
    }
    // Delete post after confirmation
    else {
        fetch(`/delete-post/${post_id}`, {method: "POST"})
        .then((response) => response.json())
        .then((data) => {
            // Remove post from display
            if (data["valid"] == true) {
                clearChildren(post);
                alert("Post permanently removed.");
            }
            else {
                alert("ಠ_ಠ You are not authorized to delete other users' posts!  ಠ_ಠ  Shame on you (ಥ﹏ಥ)");
            }
        })
        .catch((error) => console.log(error));
    }
}

function commentFeature() {
    document.querySelectorAll(".comment-toggle").forEach(function (element) {
        
        const postId = element.getAttribute("name");

        element.addEventListener("click", function () {
                
            // Open comment box
            if (element.innerHTML == "Add Comment") {
                toggleCommentBox(postId, "open");
                element.innerHTML = "Hide Comment Box";

                const submit = document.querySelector(`#submit-comment${postId}`);
            
                // Submit Comment Button Feature
                submit.addEventListener("click", function () {

                    element.innerHTML = "Add Comment";
                    toggleCommentBox(postId, "close");
                });
            }
            // Close comment box if it said "Hide Comment Box"
            else {
                element.innerHTML = "Add Comment";
                toggleCommentBox(postId, "close");
            }
        });
    });
}