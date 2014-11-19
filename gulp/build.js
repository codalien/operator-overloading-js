'use strict';

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename");


gulp.task('compress', function () {
    gulp.src('dist/browser/overload.js')
        .pipe(rename('overload.min.js'))
        .pipe(uglify({
            output: {
                comments: true
            }
        }))
        .pipe(gulp.dest('dist/browser'));
});

gulp.task('clean-browser', function () {
    return gulp.src('dist/browser', {read: false})
        .pipe(clean());
});

gulp.task('browserify', function () {
    return gulp.src('lib/overload.js')
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(rename('overload.js'))
        .pipe(gulp.dest('./dist/browser/'));
});

gulp.task('build', ['clean-browser', 'browserify', 'compress']);
