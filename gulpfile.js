'use strict';

var gulp = require('gulp');
var del = require('del');
var eslint = require('gulp-eslint');
var pegjs = require('gulp-pegjs');
var wrapper = require('gulp-wrapper');

gulp.task('clean', function () {
  return del(['tmp', 'dist']);
});

gulp.task('lint', ['clean'], function () {
  var sources = [
    'src/**/*.js',
    'test/**/*.js'
  ];

  return gulp.src(sources)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', ['lint']);

gulp.task('pegjs', ['clean'], function () {
  return gulp.src('src/**/*.pegjs')
    .pipe(pegjs())
    .pipe(wrapper({
      header: 'module.exports = '
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('js', ['test'], function () {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['pegjs', 'js']);
