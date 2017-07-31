const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
 
gulp.task('default', ['test']);

/* ==================================================== 
      The lint task. [code integrity and standar]          
   ==================================================== */
gulp.task('lint', () => {
    return gulp.src(['./source/**/*.js'])
            .pipe(eslint())
            .pipe(eslint.format()) 
            .pipe(eslint.failAfterError());
});

/* ==================================================== 
      The test task. [unit and integration testing]          
   ==================================================== */
gulp.task('test', ['lint'], () =>
    gulp.src('./source/**/*spec.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
);