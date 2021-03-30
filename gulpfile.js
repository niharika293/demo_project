const gulp = require('gulp');
const sass = require('gulp-sass'); // Converts sass to css
const cssnano = require('gulp-cssnano'); // Converts the css in 1 line
const rev = require('gulp-rev'); // Renames & adds hash strings to the CSS/JS files everytime they're sent to the browser.
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del'); //deletes files & diectories using Globs.

// A glob is a string of literal and/or wildcard characters used to match filepaths. Globbing is the act of locating files on a filesystem using one or more globs.



// Gulp contains the tasks which need to be created.
// *TASK -1 : Minifying the CSS.*
// ** : any folder/ sub-folder inside , * : any file-name.
// Pipe is a () which is calling all the sub-middlewares inside the gulp. 
// So in Gulp you can chain multiple tasks together using the pipe() method.
//  Gulp makes use of streams. There are readable and writeable streams.
// *TASK -2 : Changing the Naming convention.*
// Manifest : It stores the map of the files with their new names. example :
// {x.css -> x-12345.css, y.css -> y-12345.css}
// Whenever HTML/EJS File is referring to x.css, it'll get mapped to the new name. 
// merge : true => if the name already exists, then it'll get merge within that, 
gulp.task('css',function(done){
    console.log('Minifying CSS...');
    gulp.src('./assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css')); //Put them in a folder now, for production mode, the destination will be different, we'll make a folder -> public &  put CSS/JS etc. files there.
    
    gulp.src('./assets/**/*.css') // revisit files
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd : 'public',
        merge : true,
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

// *TASK : Minifying the JS files.*
gulp.task('js',function(done){
    console.log('Minifying JS ... ');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd : 'public',
        merge : true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

// *TASK : Minifying the Images.*

gulp.task('images',function(done){
    console.log("Compressing Images...");
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'));
    done();
});

// empty the public/assets directory.
// Whenever you're building a project, you need to clear the previous build & empty the public /assets directory.

gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});

// Series : Combines task functions and/or composed operations into larger operations that will be executed one after another, in sequential order.
gulp.task('build',gulp.series('clean:assets','css','js','images',function(done){
    console.log("Building Assets...");
    done();
}));