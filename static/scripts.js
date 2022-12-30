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

document.addEventListener("DOMContentLoaded", function() {

    // Create an object for each post
    document.querySelectorAll(".like").forEach(function(element) {

        const postId = element.getAttribute("name");
        let post = new Post(postId);
    });
    
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
});
