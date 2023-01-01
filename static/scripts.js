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


                        /*
                        console.log(post);
                        post.postData();
                        // Generate url
                        const ROOT_URL = window.location.href;
                        let url = `${ROOT_URL + post.id}`;
                        console.log(url);

                        
                        // fetch post
                        fetch(`/${post.id}`, {
                            method: "POST",
                
                            body: JSON.stringify(post),
                
                            headers: { "Content-type": "application/json; charset=UTF-8"}
                        })
                        // Convert to JSON
                        .then(response => response.json())
                        //
                        .then(response => console.log(response))
                        .catch((error) => {
                            console.log(error);
                        });
                        */
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

            console.log(post);
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