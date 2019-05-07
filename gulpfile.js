'use strict';

var gulp          = require('gulp'),
    watch         = require('gulp-watch'),
    plumber       = require('gulp-plumber'),
    prefixer      = require('gulp-autoprefixer'),
    uglify        = require('gulp-uglify'),
    sass          = require('gulp-sass'),
    rigger        = require('gulp-rigger'),
    babili        = require('gulp-babili'),
    pug           = require('gulp-pug'),
    imagemin      = require('gulp-imagemin'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload;

var path = {
        build: {
            html:   'build/',
            css:    'build/css',
            libs:   'build/libs',
            js:     'build/js',
            img:    'build/img',
            fonts:  'build/fonts/'
        },
        src: {
            html:   'src/*.pug',
            style:  'src/assets/scss/style.scss',
            js:     'src/assets/js/*.js',
            jsLibs: [
                'node_modules/three/build/three.min.js'
            ],
            img:    'src/img/**/*.*',
            fonts:  'src/fonts/**/*.*'
        },
        watch: {
            html:   'src/**/*.pug',
            style:  'src/assets/scss/**/*.scss',
            img:    'src/img/**/*.*',
            js:     'src/assets/js/**/*.js'
        },
        clean: './build'
};

var config = {
        server: {
            baseDir: "./build"
        },
        host: 'localhost',
        port: 9002,
        logPrefix: "Frontend_Devil"
};

//pug build task
gulp.task('html:build', function () {
    return gulp.src(path.src.html)
            .pipe(plumber())
            .pipe(rigger())
            .pipe(pug({pretty: true}))
            .pipe(gulp.dest(path.build.html))
            .pipe(reload({stream: true}));
});

//sass build task
gulp.task('style:build', function () {
    return gulp.src(path.src.style)
            .pipe(plumber())
            .pipe(sass())
            .pipe(prefixer())
            .pipe(gulp.dest(path.build.css))
            .pipe(reload({stream: true}));
});

//js build task
gulp.task('js:build', function () {
    return gulp.src(path.src.js)
            .pipe(plumber())
            .pipe(babili())
            .pipe(gulp.dest(path.build.js))
            .pipe(reload({stream: true}));
});
//js libs build task
gulp.task('jslibs:build', function () {
    return gulp.src(path.src.jsLibs)
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});
//images build task
gulp.task('image:build', function () {
    return gulp.src(path.src.img)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.img))
            .pipe(reload({stream: true}));
});

//fonts
gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
            .pipe(gulp.dest(path.build.fonts));
});

//build steps
gulp.task('build', [
    'html:build',
    'style:build',
    'js:build',
    'jslibs:build',
    'image:build',
    'fonts:build'
]);

//watch
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
});

//server
gulp.task('webserver', function () {
    browserSync(config);
});

//default gulp task
gulp.task('default', ['build', 'webserver', 'watch']);
