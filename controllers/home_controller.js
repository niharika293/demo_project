const Post = require('../models/Post');
const User = require('../models/User');
const Friendship = require('../models/Friendship');
const Chat = require('../models/Chat');
// Controllers are the actions/group of actions taken for the routes.
// module.exports.home = function(req,res){
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
//     Post.find({})
//     .populate('user')
//     .populate({
//         path:'comments',
//         populate:{
//             path:'user'
//         }
//     })
//     .exec(
//         function(err,posts){
//             // To get the list of all the users
//             User.find({},function(err,users){
//                 return res.render('home', //this will directly look up in the views folder 
//                 {
//                     title : "Codeial | Home",
//                     posts: posts,
//                     all_users:users
//                 }); //called using home views. 
//             });
//     }); 
// } 
// commenting the above home controller and creating a new one, as it promotes to callback-hell.
// using async await now. 
// Home Page should have the count of likes associated with each post & comment. 
module.exports.home = async function(req,res){
    try{
        let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{path:'user'},
        populate : {path : 'likes'} // for likes on comment
    }).populate('likes'); // for likes on posts
    // To get the list of all the users
    let users = await User.find({});
    let friends = new Array();
    if (req.user)/* friends list will only be loaded if thhe user is signed in */
    {
        let all_friendships = await Friendship.find({ $or: [{ from_user: req.user._id }, { to_user: req.user._id }] })
            .populate('from_user')
            .populate('to_user');/* checking the friendship model in the fields "from user" and "to_user". the current logged in user has to be in one of them. and at the same time we are also populating it to see the user ids*/
        for (let fs of all_friendships)/* storing all the friendships in an array so that it is easy to load them in the front end quickly */
        {
            // Checking if the logged in user is existing as a friend as *from_user* in the friendship schema.
            if (fs.from_user._id.toString() == req.user._id.toString())
            {
                friends.push({
                    friend_name: fs.to_user.name,
                    friend_id: fs.to_user._id,
                    friend_avatar:fs.to_user.avatar
                });
            }
            // Checking if the logged in user is existing as a friend as *to_user* in the friendship schema.
            else if (fs.to_user._id.toString() == req.user._id.toString())
            {
                friends.push({
                    friend_name: fs.from_user.name,
                    friend_id: fs.from_user._id,
                    friend_avatar:fs.from_user.avatar
                });
            }
        }
    }

    return res.render('home', //this will directly look up in the views folder 
    {
        title : "Codeial | Home",
        posts: posts,
        all_users: users,
        all_friends : friends
    }); //called using home views. 
    }catch(err){
        console.log("Error",err);
        return;
    }
};

// module.exports.add = function(req,res){
//     console.log(req.body);
//     Chat.create({from_user : req.user._id, chat})
//     return res.redirect('back');
// }
