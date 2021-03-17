// This file will fetch the data from the post creation form & sends it in the JSON format to the controller 
{
    console.log("Testing script!");
    // method to submit the form data for new post using AJAX.
    let createPost = function () {
        let newPostForm = $("#new-post-form");
        newPostForm.submit(function (e) {
            e.preventDefault(); //prevents the form from submitting
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data) {
                    //console.log(data);
                    let newPost = newPostDom(data.data.post);
                    $("#posts-list-container>ul").prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    // req.flash('post published!');
                    // call the create comment class
                    new PostComments(data.data.post._id);
                    
                    // attach the Toggle-like class to the link of <a> tag whenever a new post is create using DOM /dynamically.
                    new ToggleLike($(' .toggle-like-button',newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }
    // method to create a post in DOM
    // Whenever a new Post is added, I need to show 0 likes dynamically on the Post using DOM.
    let newPostDom = function (post) {
        return $(`<li id ="post-${post._id}">
         <p>
             ${post.content}
             <br>
             <small>
                 <a class="delete-post-button" href="/posts/destroy/${ post._id }">Delete Post</a>
             </small>
             <small>
                 ${post.user.name}
             </small>
             <br>
             <a class="toggle-like-button" data-likes="0" href="/likes/toggle?id=${ post._id}&type=Post">
                <i class="fas fa-thumbs-up"></i>0 
            </a>
         </p>
         <div class="post-comments">
                 <form id="post-${ post._id }-comments-form" action="/comments/create" method="POST">
                     <input type="text" name="content" placeholder="Type here to add comment..." required>
                     <input type="hidden" name="post" value="${post._id}">
                     <input type="submit" value="Add Comment">
                 </form>
         </div>
         <div class="post-comments-list">
             <ul id="post-comments-${post._id}">
             </ul>
         </div>
     </li>`)
    }

    // method to delete a post in DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){

            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success:function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post and associated comments Deleted!!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error:function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1];
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();
}