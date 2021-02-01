// Acquire mongoose library
const mongoose = require('mongoose');
// Create a schema
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
},{
    timestamps:true // this creates the fields - createdAt, modifiedAt
}); 
// tell the mongoose that user is a model
const User = mongoose.model('User',userSchema);
module.exports = User;