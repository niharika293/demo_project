{
    console.log("Testing comments script! ");
    // method to submit the form data for new comment using AJAX
    let createComment = function(){
        let newCommentForm = $("#new-comment-form");
       // console.log(newCommentForm);
       newCommentForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type : 'post',
                url : '/comments/create',
                data : newCommentForm.serialize(),
                success : function(data){
                     console.log(data);
                    let newComment = newCommentDom(data.data.comment);
                    console.log(newComment);
                    $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                    deleteComment($(' .delete-comment-button', newComment));
                    new Noty({
                        theme : 'relax',
                        text : "Comment Published!",
                        type : "success",
                        layout : 'topRight',
                        timeout : 1500
                    }).show();
                },
                error : function(error){
                    console.log(error.responseText);
                }
            });
       });
    }

    // method to create a comment in DOM
    let newCommentDom = function(comment){
        return $(`<li id = "comment-${comment._id}">
        <p>
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">Delete Comment</a>
            </small>
            ${comment.content}
            <br>
            <small>
               ${comment.user.name}
            </small>
        </p>
    </li>`);
    }

    // method to delete a post in DOM
    let deleteComment = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type : 'get',
                url : $(deleteLink).prop('href'),
                success : function(data){
                    //console.log("from delete",data.data.comment);
                    $(`#comment-${data.data.comment_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error : function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    createComment();
}