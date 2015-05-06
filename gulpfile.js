var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');


gulp.task('css', function() {
    gulp.src(['media/css/**/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(concat('bundle.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('media/css/'));
});


gulp.task('watch', function() {
    gulp.watch('media/css/**/*.scss', ['css']);
});


gulp.task('build', ['css']);
gulp.task('default', ['css', 'watch']);
