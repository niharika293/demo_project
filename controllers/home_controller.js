const Post = require('../models/Post');
// Controllers are the actions/group of actions taken for the routes.
module.exports.home = function(req,res){
    // return res.end('<h1>Express is up for codeial! </h1>');
    // reading from cookies.
    // console.log(req.cookies);
    // altering the cookies : since they're coming through requests and going back through response.
    // res.cookie('user_id',25);
    // Showing the posts on home page
    // Post.find({},function(err,posts){
    //     return res.render('home', //this will directly look up in the views folder 
    //     {
    //         title : "Codeial | Home",
    //         posts: posts
    //     }); //called using home views. 
    // }); 
    //above method has access to oly the user id of the user who's logged in, hence we need to pre-populate
    // the user data before usage.
    //this method finds all the posts made by the user who's logged in and populates the user
    Post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    })
    .exec(function(err,posts){
        return res.render('home', //this will directly look up in the views folder 
        {
            title : "Codeial | Home",
            posts: posts
        }); //called using home views. 
    }); 
}