const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
var spritesmith = require('gulp.spritesmith');

gulp.task('less-common', async function () {
  return gulp.src(['./src/less/common/common.less', './src/less/components/common/*.less'])
    .pipe(less())
    .pipe(concat('common.css'))
    .pipe(autoprefixer())
    // .pipe(cleanCSS())
    .pipe(gulp.dest('./output/css'));
});

gulp.task('less-style', async function () {
  return gulp.src(['./src/less/components/*.less'])
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(autoprefixer())
    // .pipe(cleanCSS())
    .pipe(gulp.dest('./output/css'));
});

gulp.task('less-guide', async function () {
  return gulp.src('./src/less/guide/guide.less')
    .pipe(less())
    .pipe(concat('guide.css'))
    .pipe(autoprefixer())
    // .pipe(cleanCSS())
    .pipe(gulp.dest('./output/guide'));
});

gulp.task('sprite', async function(){
  var spriteData = gulp.src('./src/images/sprite/service-app/*.png').pipe(spritesmith({
    imgName: 'sp-service-app.png',
    padding: 2,
    cssName: 'sp-service-app.css'
  }));
  spriteData.img.pipe(gulp.dest('./output/images'));
  spriteData.css.pipe(gulp.dest('./src/images/sprite'));
});

gulp.task('sprite-2x', async function(){
  var spriteData = gulp.src('./src/images/sprite/service-app-2x/*.png').pipe(spritesmith({
    imgName: 'sp-service-app-2x.png',
    padding: 4,
    cssName: 'sp-service-app-2x.css'
  }));
  spriteData.img.pipe(gulp.dest('./output/images'));
});

// 파일 변경 감지
gulp.task('watch', async function () {
  gulp.watch('./src/less/*/*.less', gulp.series(['less-common', 'less-style']));
  gulp.watch('./src/less/*/*/*.less', gulp.series(['less-common', 'less-style']));
  gulp.watch('./src/less/guide/guide.less', gulp.series(['less-guide']));
  gulp.watch('./src/images/sprite/*/*.png', gulp.series(['sprite', 'sprite-2x']));
});

//gulp를 실행하면 default로 실행되는 gulp task 명시
gulp.task('default', gulp.series(['less-common', 'less-style', 'less-guide', 'sprite', 'sprite-2x', 'watch']));