var gulp = require('gulp');
var sass = require('gulp-sass')(require('node-sass'));
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
sass.compiler = require('node-sass');

gulp.task('common-scss', async function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(concat('common.css'))
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'expanded', // compressed compact expanded
      sourceComments: false // 주석
    }))
    .pipe(gulp.dest('./output/css'));
});

gulp.task('guide-scss', async function () {
  return gulp
    .src('./src/scss/guide/guide.scss')
    .pipe(sass())
    .pipe(concat('guide.css'))
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'expanded', // compressed compact expanded
      sourceComments: false // 주석
    }))
    .pipe(gulp.dest('./output/guide'));
});

gulp.task('watch', async function () {
  gulp.watch('./src/scss/*.scss', gulp.series(['common-scss']));
  gulp.watch('./src/scss/guide/guide.scss', gulp.series(['guide-scss']));
});

gulp.task('default', gulp.series(['common-scss', 'guide-scss', 'watch']));