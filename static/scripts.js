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

    // fetch();

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

function likeFeature() {
    document.querySelectorAll(".like").forEach(function(element) {
        
        // Click Like button
        element.addEventListener("click", function() {

            const post = findPost(element.getAttribute("name"));
            const button = document.querySelector(`button[name$=${post.id}]`)
            
            // If user hasn't liked it already
            if (button.innerHTML === "Like") {
                // Update like count, change text to "Unlike"
                post.addLike();
                button.innerHTML = "Unlike";
            }
            // If user already has liked post
            else {
                post.removeLike();
                button.innerHTML = "Like"
            }
            // Update number of likes on webpage
            document.querySelector(`h4[name$=${post.id}]`).innerHTML = `${post.likes} likes`;
        });

    });
}

function commentFeature() {
    document.querySelectorAll(".comment").forEach(function (element) {
        
        const post = findPost(element.getAttribute("name"));

        element.addEventListener("click", function () {
            
            const inputdiv = element.nextElementSibling;
                
            // Open comment box
            if (element.innerHTML == "Add Comment") {
                const textBox = document.createElement('textarea');
                const submit = document.createElement('input');
                submit.setAttribute("type", "submit");
                submit.setAttribute("class", "button")
                submit.setAttribute("value", "Comment");
                textBox.setAttribute("class", "text-box");

                // Submit Comment Button Feature
                submit.addEventListener("click", function () {
    
                    if (textBox.value) {
                        post.addComment(textBox.value);
                        post.nComments++;
                        textBox.value = "";
                        const commentdiv = document.querySelector(`#comments${post.id}`);
                        // Clear comments
                        clearChildren(commentdiv);

                        // Display Comments
                        for (let i = 0; i < post.nComments; i++) {
                            const comment = document.createElement("div");
                            comment.innerHTML = post.comments[i];
                            comment.setAttribute("class", "comment");
                            
                            commentdiv.append(comment);
                        }
                    }
                });

                // Append the textbox and submit button
                inputdiv.append(textBox);
                inputdiv.append(submit);
                element.innerHTML = "Hide Comment Box";
            }

            // Close comment box if it said "Hide Comment Box"
            else {
                clearChildren(inputdiv);
                element.innerHTML = "Add Comment";
            }

        });
    });
}

document.addEventListener("DOMContentLoaded", function() {

    // Create an object for each post
    createPosts();
    
    // Like and Unlike Feature
    likeFeature();

    // Comment Feature
    commentFeature();
});

