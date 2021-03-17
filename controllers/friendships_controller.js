const User = require('../models/User');
const Friendship = require('../models/Friendship');

module.exports.toggleFriendship = async function(req,res){
    try{
        // 1. URL (e.g for Add friend): friends/toggle/?id=abcde&type=Add
        let are_friends = false; //beacuse only then the user will be able to add a friend, & reflect the increment in the DB.
        let from_id = req.user._id;
        let to_id = req.params.id;
        // let user = await User.findById(req.params.id); 
        let user = await User.findOne({_id : req.params.id}); 

        // Find the user from user DB who sent the request.
        // Users can add as friends without accepting the friend request.

        // let to_id = User.findById((req.query.id),function(err,user){
        //     if(err){
        //         console.log("Error in finding user", err);
        //         return;
        //     }
        //     console.log("printing to found user" , user);
        // });
        
    //    let newFriend;

        // Check if a friendship exists
        Friendship.findOne({ $or: [{from_user : from_id, to_user : to_id},{from_user : to_id, to_user : from_id}]},
            function(err, existing_friendship){
                console.log(existing_friendship);
                if(err){
                    console.log('Error in finding friendship',err);
                    return;
                }
                if(existing_friendship){
                     /* updating users database */
                    User.findByIdAndUpdate(from_id, { $pull: { friendships: existing_friendship._id } }, function (error, data)
                    {
                        if (error)
                        {
                            console.log('Error in removing the friendship from the user', error);
                            return;
                        }
                        console.log(data);
                    });
                    User.findByIdAndUpdate(to_id, { $pull: { friendships: existing_friendship._id } }, function (error, data)
                    {
                        if (error)
                        {
                            console.log('Error in removing the friendship from the user', error);
                            return;
                        }
                    });

                    /* updating friendships database */
                    Friendship.deleteOne({$or:[{ from_user: from_id, to_user: to_id }, { from_user: to_id, to_user: from_id }]}, function (error,data)
                    {
                        if (error)
                        {
                            console.log('Unable to remove friendship', error);
                            return;
                        }
                        console.log('Deleted Friendship!');
                    });
                }
                else{
                     /* updating friendships database */
                    Friendship.create({ from_user: from_id , to_user: to_id }, function (error, new_friendship)
                    {
                        if (error)
                        {
                            console.log('There was an error in creating a friendship!', error);
                        }
                        new_friendship.save();
                        /* updating users database */
                        User.findByIdAndUpdate(from_id, { $push: { friendships: new_friendship._id } }, function (error, data)
                        {
                            if (error)
                            {
                                console.log('Error in adding the friendship to the user database', error);
                                return;
                            }
                            console.log(data);
                        });
                        User.findByIdAndUpdate(to_id, { $push: { friendships: new_friendship._id } }, function (error, data)
                        {
                            if (error)
                            {
                                console.log('Error in adding the friendship to the user database', error);
                                return;
                            }
                            console.log(data);
                        });
                    });
                    // are_friends = true;
                }
            }
        );
        
        return res.redirect('back');
    }
    catch(err){
        console.log(err);
        return res.json(500,{
            message : "Internal Server Error!"
        });
    }

}