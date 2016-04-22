// Require
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var eslint = require('gulp-eslint');
var del = require('del');
var path = require('path');
var browserSync = require('browser-sync');

// Vars
var src = 'src/';
var dst = 'dist/';
var tplPath = 'src/templates'; //must be same as fileManagerConfig.tplPath
var jsFile = 'angular-filemanager.min.js';
var cssFile = 'angular-filemanager.min.css';

gulp.task('clean', function (cb) {
  del(dst + '/*', cb);
});

gulp.task('cache-templates', function () {
  return gulp.src(tplPath + '/*.html')
    .pipe(templateCache(jsFile, {
      module: 'FileManagerApp',
      base: function(file) {
        return tplPath + '/' + path.basename(file.history);
      }
    }))
    .pipe(gulp.dest(dst));
});

gulp.task('concat-uglify-js', ['cache-templates'], function() {
  return gulp.src([
    src + 'js/app.js',
      src + 'js/*/*.js',
      dst + '/' + jsFile
    ])
    .pipe(concat(jsFile))
    .pipe(uglify())
    .pipe(gulp.dest(dst));
});

gulp.task('scss', function () {
    gulp.src('./app/scss/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./app/scss/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('./app/css'));
});

gulp.task('css', function () {
    gulp.src('./app/scss/*.css')
        .pipe(gulp.dest('./app/css'))
})

gulp.task('watch',function(){
    gulp.watch('./app/scss/*.scss',['scss']);
});

gulp.task('serve', function() {
    browserSync({
        files: "**",
        server: {
            baseDir: "./"
        }
    });
	gulp.watch('./app/scss/*.scss',['scss']);
	browserSync.reload();
});


gulp.task('default', ['concat-uglify-js', 'scss', 'css']);
gulp.task('build', ['clean', 'default']);

