'use strict';

var gulp = require('gulp');

require('require-dir')('./gulp');

gulp.task('default', ['lint'], function () {
    gulp.start('build');
});
