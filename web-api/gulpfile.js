const gulp = require('gulp')
const mocha = require('gulp-mocha')
const eslint = require('gulp-eslint')

gulp.task('default', ['integrate'])

/* ==================================================== 
      The lint task. [code integrity and standar]          
   ==================================================== */
gulp.task('lint', () => {
  return gulp.src(['./**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

/* ==================================================== 
      The test task. [unit and integration testing]          
   ==================================================== */
gulp.task('test', () =>
  gulp.src('./source/**/*spec.js', {read: false})
    .pipe(mocha())
)

/* ==================================================== 
      The integrate task. [lin and test the code]          
   ==================================================== */
gulp.task('integrate', ['lint', 'test'])
