/**
 * 初始化
 * npm install gulp-util gulp-imagemin gulp-sass gulp-minify-css gulp-uglify gulp-rename gulp-concat gulp-clean gulp-clean tiny-lr --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'), //基础库
    imagemin = require('gulp-imagemin'), //图片压缩
    sass = require('gulp-sass'), //sass
    minifycss = require('gulp-minify-css'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹
    nodemon = require('nodemon'), //监控文件修改，重启node服务
    livereload = require('gulp-livereload'),// 浏览器同步
    browserSync = require('browser-sync'), // 浏览器同步
    reload = browserSync.reload; // 自动刷新

// HTML处理
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';

    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst))
        .pipe(reload({stream: true}));
});

// 样式处理
gulp.task('css', function() {
    var cssSrc = './src/scss/*.scss',
        cssDst = './dist/css';

    gulp.src(cssSrc)
        .pipe(sass({
            style: 'expanded'
        }))
        .pipe(gulp.dest(cssDst))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(cssDst))
        .pipe(reload({stream: true}));
});

// 图片处理
gulp.task('images', function() {
    var imgSrc = './src/images/**/*',
        imgDst = './dist/images';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst))
        .pipe(reload({stream: true}));
})

// js处理
gulp.task('js', function() {
    var mainSrc = './src/js/main.js',
        mainDst = './dist/js/',
        appSrc = './src/js/vendor/*.js',
        appDst = './dist/js/vendor/';

        libSrc = './src/js/libs/*.js',
        libDst = './dist/js/libs/';


    gulp.src(mainSrc)
        .pipe(jshint(require('./jshintConf')))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(mainDst))
        .pipe(uglify({
            compress: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(mainDst))
        .pipe(reload({stream: true}));

    gulp.src(appSrc)
        .pipe(uglify())
        // .pipe(concat("vendor.js"))
        .pipe(gulp.dest(appDst))
        .pipe(reload({stream: true}));

    gulp.src(libSrc)
        .pipe(uglify())
        // .pipe(concat("vendor.js"))
        .pipe(gulp.dest(libDst))
        .pipe(reload({stream: true}));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dist/css', './dist/js', './dist/images'], {
            read: false
        })
        .pipe(clean());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function() {
    gulp.start('html', 'css', 'images', 'js');
});

// 定义web服务模块，增加浏览器同步浏览
gulp.task('serve-sync', function() {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
});

// 监听任务 运行语句 gulp watch
gulp.task('watch', function() {
    // livereload.listen(); 
    gulp.run('serve-sync');

    gulp.watch('./src/*.html', function(event) {
        gulp.run('html');
    })

    // 监听css
    gulp.watch('./src/scss/*.scss', function() {
        gulp.run('css');
    });

    // 监听images
    gulp.watch('./src/images/**/*', function() {
        gulp.run('images');
    });

    // 监听js
    gulp.watch(['./src/js/main.js', './src/js/vendor/*.js'], function() {
        gulp.run('js');
    });
});