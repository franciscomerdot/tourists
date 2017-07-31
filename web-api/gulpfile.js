const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
 
gulp.task('default', function () {
    return gulp.src(['./source/**/*.js'])
            .pipe(eslint())
            .pipe(eslint.format()) 
            .pipe(eslint.failAfterError());
});