const gulp = require('gulp');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify-es').default;

gulp.task('clean', () => {
    return del(['src-front/prod']);
});

gulp.task('analyze-js', () => {
    return gulp.src(['src-front/dev/js/*.js']).pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError());
});

gulp.task('uglify-js', () => {
    return gulp.src('src-front/dev/js/**/*.js').pipe(uglify()).pipe(gulp.dest('src-front/prod/js'));
});

gulp.task('copy-css', () => {
    return gulp.src('src-front/dev/css/**/*.css').pipe(cleanCSS({ level: 2 })).pipe(gulp.dest('src-front/prod/css'));
});

gulp.task('copy-img', () => {
    return gulp.src('src-front/dev/img/**/*.*').pipe(imagemin()).pipe(gulp.dest('src-front/prod/img'));
});

gulp.task('copy-snd', () => {
    return gulp.src('src-front/dev/snd/**/*.*').pipe(gulp.dest('src-front/prod/snd'));
});

gulp.task('copy-html', () => {
    return gulp.src('src-front/dev/index.html').pipe(htmlclean()).pipe(gulp.dest('src-front/prod'));
});

gulp.task('copy-js', gulp.series('analyze-js', 'uglify-js'));

gulp.task('copy', gulp.parallel('copy-js', 'copy-css', 'copy-img', 'copy-snd', 'copy-html'));

gulp.task('default', gulp.series('clean', 'copy'));