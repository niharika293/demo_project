// these helpers can be used in the views by passing them to locals.

// Create a helper () which will be based on prodution / development environment, producing  path string for
// the css/js/images files which are there in the assets folder. 

// Defining a global() whih will be there in the app.

const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) =>{
    app.locals.assetPath = function(filePath){
        if(env.name == 'development'){
            return filePath;
        }

        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
   }
}