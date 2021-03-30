const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('../config/environment');

// transporter : defines the configuration using which emails will be sent. 
// port = 587, since we'll be using TLS(highest form of security)
// secure : false , as we're not using two-factor-auhentication 
let transporter = nodemailer.createTransport(env.smtp);
// to use template engines.
// using arrow(), as we don't want "this" to be assigned.
// relativePath : from where the email is to be sent.
// data : content to be passed to the EJS.
let renderTemplate = (data,  relativePath) => {
    let mailHTML; //stores the entire HTML content to be sent inside the email.
    ejs.renderFile(path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err, template){
            if(err){
                console.log("Error in rendering the template",err);
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML; // returned from outside, as we want the content to be rendered first, also we'll be able to catch some other error, if in case any. 
                    
} 
// we'll be exporting 2 keys
module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}