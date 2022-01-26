const { src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const del = require('del');

function assets() {
  return src('src/img/**/*.*')
    .pipe(dest('dist/img'))
    .pipe(browserSync.stream());
}

exports.assets = assets;

function test() {
  return src('src/test/**/*.*')
    .pipe(dest('dist/test'))
    .pipe(browserSync.stream());
}

exports.test = test;

function html() {
  return src('src/pug/*.pug')
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(dest('dist/'))
    .pipe(browserSync.stream());
}

exports.html = html;

function css() {
  return src('src/scss/style.scss')
    .pipe(
      sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError)
    )
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

exports.css = css;

function js() {
  return src(['src/js/utils/*.js', 'src/js/components/*.js', 'src/js/script.js', 'src/js/pages/*.js'])
    .pipe(
      babel({
        presets: ['@babel/preset-env']
      })
    )
    .pipe(concat('script.js'))
    .pipe(dest('dist/js/'))
    .pipe(browserSync.stream());
}

exports.js = js;

function clean(cb) {
  return del(['./dist/']);
}

function myServer() {
  browserSync.init({
    server: {
      baseDir: 'dist' // папка для локального сервера
    },
    notify: false
  });

  watch('src/**/*.pug', { usePolling: true }, html);
  watch('src/**/*.html', { usePolling: true }, html);
  watch('src/scss/**/*.scss', { usePolling: true }, css);
  watch('src/js/**/*.js', { usePolling: true }, js);
  watch('src/img/**/*.*', { usePolling: true }, assets);
  watch('src/test/**/*.*', { usePolling: true }, test);
}

exports.default = series(clean, assets, test, css, js,  html, myServer);
