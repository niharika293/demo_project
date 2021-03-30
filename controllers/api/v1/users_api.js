const User = require('../../../models/User');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');
// Sign-In and Create a session for the user.
module.exports.createSession = async function (req, res) {
    try{
        let user = await User.findOne({email : req.body.email});
        if(!user || user.password!=req.body.password){
            return res.json(422,{
                message : "Invalid Username / Password!"
            });
        }
        return res.json(200,{
            message : "Sign-In successful, here's your token, KEEP IT SAFE!!",
            data :{
                //sign the given payload into a JSON Web Token
                // 'codeial' here is the key used for encryption
                // expiresIn is in milliseconds.
                //  user.toJSON() => this makes the user to get encrypted. 
                token : jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn:'100000'}) 
            }
        })
    }
    catch(err){
        console.log("Error", err);
        return res.json(500, {
            message: "Internal server error!"
        });
    }
}