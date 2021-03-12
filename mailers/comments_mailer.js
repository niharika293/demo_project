const nodemailer = require('../config/nodemailer');

// Another way of exporting a method
exports.newComment = (comment)=>{
    console.log("Inside New Comment Mailer",comment);
    // Specify that we'll be using Mailer template from the views
    let htmlString = nodemailer.renderTemplate( {comment : comment},'/comments/new_comment.ejs');
    nodemailer.transporter.sendMail({
        from : 'yourusername@gmail.com',
        to : comment.user.email,
        subject : "New Comment Published",
        html : htmlString
    },(err,info)=>{
        if(err){
            console.log("Error in sending mail", err);
            return;
        }
        console.log("Message sent", info);
        return;
    });
}