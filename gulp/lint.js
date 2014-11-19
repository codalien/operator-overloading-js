'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    size = require('gulp-size');

gulp.task('lint', function () {
    return gulp.src('{lib,examples,gulp}/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(size());
});