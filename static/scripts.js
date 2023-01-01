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
}

function clearChildren(parent) {
    while (parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

function createPosts() {
    document.querySelectorAll(".like").forEach(function(element) {

        const postId = element.getAttribute("name");
        let post = new Post(postId);
    });
}

function toggleCommentBox(postId, option) {
    if (option == "open") {
        document.querySelector(`#comment-input${postId}`).style.display = "block";
    }
    else {
        document.querySelector(`#comment-input${postId}`).style.display = "none";
    }
}

function commentFeature() {
    document.querySelectorAll(".comment-toggle").forEach(function (element) {
        
        const postId = element.getAttribute("name");

        element.addEventListener("click", function () {
            
            const inputform = element.nextElementSibling;
                
            // Open comment box
            if (element.innerHTML == "Add Comment") {
                toggleCommentBox(postId, "open");
                element.innerHTML = "Hide Comment Box";

                const submit = document.querySelector(`#submit-comment${postId}`);
                const textBox = document.querySelector(`#textbox${postId}`)
            
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

document.addEventListener("DOMContentLoaded", function() {

    // Create an object for each post
    createPosts();
    
    // Comment Feature
    commentFeature();


});

// Like and Unlike Feature
function likeFeature(postId) {
    const button = document.querySelector(`#like-button${postId}`);
    const count = document.querySelector(`#like-count${postId}`);

    fetch(`/like-post/${postId}`, { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
        console.log(`Data: ${data["likes"]}`);
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
        console.log(data["followers"]);
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

// Comment Feature
function updateComments(post_id) {
    commentdiv = 1;
}