        var gulp = require('gulp'),
            karma = require('karma').server,
            concat = require('gulp-concat'),
            uglify = require('gulp-uglify'),
            rename = require('gulp-rename'),
            templateCache = require('gulp-angular-templatecache'),
            sourceFiles = [
                'src/sms/sms.prefix',
                'src/sms/sms.js',
                'src/sms/templates/**/*.js',
                'src/sms/directives/**/*.js',
                'src/sms/filters/**/*.js',
                'src/sms/services/**/*.js',
                'src/sms/sms.suffix'
            ];


        gulp.task('bundleTempaltes', function() {
            gulp.src('src/sms/templates/**/*.html')
                .pipe(templateCache({
                    module: "ysSmsVerification.templates"
                }))
                .pipe(gulp.dest('src/sms/templates'))
        });

        gulp.task('build', ['bundleTempaltes'], function() {
            gulp.src(sourceFiles)
                .pipe(concat('sms.js'))
                .pipe(gulp.dest('./dist/'))
                .pipe(uglify())
                .pipe(rename('sms.min.js'))
                .pipe(gulp.dest('./dist'))
        });


        gulp.task('watch', function() {
            gulp.watch(sourceFiles, ['build']);
            gulp.watch('src/sms/templates/*.html',['build']);
        });


        gulp.task('default', ['build']);
