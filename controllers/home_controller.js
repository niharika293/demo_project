// Controllers are the actions/group of actions taken for the routes.
module.exports.home = function(req,res){
    // return res.end('<h1>Express is up for codeial! </h1>');
    // reading from cookies.
    console.log(req.cookies);
    // altering the cookies : since they're coming through requests and going back through response.
    res.cookie('user_id',25);
    return res.render('home', //this will directly look up in the views folder 
        {
            title : "Home"
        }
    ); //called using home views. 
}