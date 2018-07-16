var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var extend = require('util')._extend;
var minifyCss = require('gulp-clean-css');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var fs = require("fs");
var webpack_stream = require('webpack-stream');
var webpack_config = require('./webpack.config.js');
var webserver = require('gulp-webserver');
var rimraf = require('rimraf');
var e = false;

function putTemplateFileToDist(templateContent, templateName) {
    fs.writeFileSync(config.destDirectory.htmlRoot + '/' + templateName + '.html', templateContent);
    fs.writeFileSync(config.tmpDir + '/html/' + templateName + '.html', templateContent);
}

function recursiveTemplateSearch(templateContent, templateName) {
    var nestedTemplates = templateContent.match(/<@=.*=@>/g);

    if (nestedTemplates && nestedTemplates.length) {
        for (var i = 0; i < nestedTemplates.length; i++) {
            var nestedTemplateTag = nestedTemplates[i];
            var nestedTemplateName = getTemplateNameFromTag(nestedTemplateTag);
            var nestedTemplateContent = getContentForTemplate(nestedTemplateTag);

            nestedTemplateContent = recursiveTemplateSearch(nestedTemplateContent, nestedTemplateName);

            templateContent = templateContent.replace(nestedTemplateTag, nestedTemplateContent);

            if (i === nestedTemplates.length - 1) {
                putTemplateFileToDist(nestedTemplateContent, nestedTemplateName);
            }
        }
    } else {
        putTemplateFileToDist(templateContent, templateName);
    }

    return templateContent
        .replace(/  /g, '')
        .replace(/'/g, '&quot;')
        .replace(/\n/g, '');
}

function getTemplateNameFromTag(templateTag) {
    var name = templateTag.replace(/</g, '').replace(/>/g, '').replace(/=/g, '').replace(/@/g, '').replace(/ /g, '');

    return name;
}

function getContentForTemplate(templateTag) {
    var templateName = getTemplateNameFromTag(templateTag);
    var templateContent = fs.readFileSync(config.codeDirectory.root + '/html/' + templateName + '.html', "utf8");

    return templateContent;
}

function handleTemplateBinding(match) {
    var templateContent = getContentForTemplate(match);
    var templateName = getTemplateNameFromTag(match);

    templateContent = recursiveTemplateSearch(templateContent, templateName);

    return templateContent;
}

function buildApplicationCode() {
    fs.mkdir(config.tmpDir, function (err) {
        if (err) {
            gutil.log('error creating .tmp dir!', err);
        } else {
            fs.mkdir(config.tmpDir + '/html', function (err) {
                if (!err) {
                    gulp.src('./code/script/**')
                        .pipe(gulp.dest(config.tmpDir))
                        .on('end', function () {
                            gulp.src(config.codeDirectory.root + '/script/app.js')
                                .pipe(replace(/<@=.*=@>/, function (match) {
                                    return handleTemplateBinding(match);
                                }))
                                .pipe(gulp.dest(config.tmpDir));

                            return gulp.src(config.codeDirectory.root + '/html/async/**')
                                .pipe(replace(/<@=.*=@>/, function (match) {
                                    return handleTemplateBinding(match);
                                }))
                                .pipe(gulp.dest(config.tmpDir + '/html'))
                                .pipe(gulp.dest(config.destDirectory.htmlRoot))
                                .on('end', function () {
                                    return gulp.src(config.tmpDir + '/main.js')
                                        .pipe(webpack_stream(webpack_config))
                                        .pipe(gulp.dest(config.destDirectory.root));
                                });
                        });
                }
            });

        }
    });
}

var config = extend({
    codeDirectory: {
        root: './code',
        js: './code/script/main.js',
        scss: './code/style/application.scss',
        css: './code/style/*.css',
        html: './code/html/*.html'
    },
    destDirectory: {
        root: './app',
        htmlRoot: './app/html',
        jsFile: 'application.js',
        cssFile: 'application.css'
    },
    assetDirectory: {
        root: './assets/**/*',
        dir: './app/assets'
    },
    tmpDir: './.tmp',
    browsersCompatibility: ['Firefox 20', 'Safari 8', 'IE 10', 'Chrome 20', 'Edge 12']
});

gulp.task('buildCss', function () {
    return gulp.src([config.codeDirectory.scss])
        .pipe(sass())
        .pipe(autoprefix({
            browsers: config.browsersCompatibility
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest(config.destDirectory.root));
});
gulp.task('watchScss', ['buildCss'], function () {
    gulp.watch(config.codeDirectory.root + '/style/*.scss', ['buildCss'])
});

gulp.task('buildJs', function () {
    buildApplicationCode();
});

gulp.task('runCleanProject', function () {
    rimraf(config.tmpDir, function () {
        buildApplicationCode();
    });
});
gulp.task('webserver', ['runCleanProject', 'watchScss'], function () {
    gulp.src('./app')
        .pipe(webserver({
            port: 7070,
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

gulp.task('default', ['webserver']);
