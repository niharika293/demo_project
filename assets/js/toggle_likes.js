// Create a class Toggle Likes when a link is clicked using AJAX.

class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement; //in this case, hold the <a> tag
        this.toggleLike(); //calls the toggleLike() for this
    }
    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this; // also holds the <a> tag.

            $.ajax({
                type : 'POST',
                url : $(self).attr('href')
            }).done(function(data){
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if(data.data.deleted == true){
                    likesCount -= 1;
                }
                else{
                    likesCount += 1;
                }
                $(self).attr('data-likes',likesCount);
                $(self).html(`<i class="fas fa-thumbs-up"></i>`+`${likesCount}`);
            }).fail(function(errData){
                console.log('Error in completing the request',errData);
            });
        });
    }
}