
const gulp = require('gulp');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify-es').default;
const fs = require('fs');
const swPrecache = require('sw-precache');

const pkg = require('./package.json');
const config = require('./src-back/config.json');

gulp.task('prepare', () => {
    return del(['src-front/prod', 'src-front/dev/service-worker.js']);
});

gulp.task('analyze-js', () => {
    return gulp.src(['src-front/dev/js/*.js', 'src-front/dev/js/states/*.js', 'src-front/dev/js/classes/*.js']).pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError());
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
    return gulp.src('src-front/dev/*.html').pipe(htmlclean()).pipe(gulp.dest('src-front/prod'));
});

gulp.task('service-worker', (callback) => {
    const baseDir = 'src-front/prod';
    const fileName = 'service-worker.js';
    const dynamicUrlToDependencies = {};
    config.expressStaticsVendorsConf.vendors.forEach((vendor, index, array) => {
        vendor.files.forEach((file, index, array) => {
            dynamicUrlToDependencies[config.expressStaticsVendorsConf.path + '/' + file] = [vendor.folder + '/' + file];
        });
    });
    config.expressViewsConf.files.forEach((file, index, array) => {
        dynamicUrlToDependencies[file.path] = [config.expressViewsConf.folder + '/' + file.value];
    });
    swPrecache.write('src-front/dev/' + fileName, {
        staticFileGlobs: [
            baseDir + '/**/*'
        ],
        dynamicUrlToDependencies: dynamicUrlToDependencies,
        stripPrefix: baseDir,
    }, function () {
        gulp.src('src-front/dev/' + fileName).pipe(uglify()).pipe(gulp.dest('src-front/prod'));
        callback();
    });
});

gulp.task('copy-js', gulp.series('analyze-js', 'uglify-js'));

gulp.task('optimize', gulp.parallel('copy-js', 'copy-css', 'copy-img', 'copy-snd', 'copy-html'));

gulp.task('finalize', gulp.parallel('service-worker'));

gulp.task('default', gulp.series('prepare', 'optimize', 'finalize'));