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
    return gulp.src(['src-front/dev/js/*.js', 'src-front/dev/js/states/*.js']).pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError());
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

gulp.task('manifest.cache', (callback) => {
    let count = 0;
    const baseDir = 'src-front/prod';
    const path = baseDir + '/manifest.cache';
    const readDir = (dir) => {
        fs.readdirSync(dir).forEach((item, index, array) => {
            const path = dir + '/' + item;
            const stats = fs.statSync(path);
            if (stats.isDirectory()) {
                readDir(path);
            }
            else {
                content += path.replace(baseDir, '') + '\n';
                count++;
            }
        });
    };
    let content = '';
    content = 'CACHE MANIFEST\n';
    content += '# ' + pkg.version + '\n';
    content += 'CACHE:\n';
    readDir(baseDir);
    const vendorsConf = config.expressStaticsVendorsConf;
    vendorsConf.vendors.forEach((vendor, index, array) => {
        vendor.files.forEach((file, index, array) => {
            content += vendorsConf.path + '/' + file + '\n';
            count++;
        });
    });
    content += 'NETWORK:\n';
    content += '*\n';
    content += 'FALLBACK:\n';
    fs.writeFileSync(path, content);
    console.log('Total manifest size is about ? for ' + count + ' resources.');
    callback();
});

gulp.task('service-worker', (callback) => {
    const baseDir = 'src-front/prod';
    const fileName = 'service-worker.js';
    const dynamicUrlToDependencies = {};
    const vendorsConf = config.expressStaticsVendorsConf;
    vendorsConf.vendors.forEach((vendor, index, array) => {
        vendor.files.forEach((file, index, array) => {
            dynamicUrlToDependencies[vendorsConf.path + '/' + file] = [vendor.folder + '/' + file];
        });
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

gulp.task('finalize', gulp.parallel('service-worker', 'manifest.cache'));

gulp.task('default', gulp.series('prepare', 'optimize', 'finalize'));