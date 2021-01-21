module.exports.posts = function(req,res){
     // res.end('<h1>Rendering output from Posts Controller. </h1>');
     res.render('posts',{
          title:"Posts"
     });
}