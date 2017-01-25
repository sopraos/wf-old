'use strict';


// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();


// Paths to project folders
var paths = {
    // Styles
    styles: {
      input: './MySrc/styles/main.scss',
      output: './web/css/'
    },
    // Scripts
    scripts: {
      input: [
        './MySrc/scripts/libs/*.js',
        './MySrc/scripts/core.js',
        './MySrc/scripts/components/*.js'
      ],
      output: './web/js/'
    }
};

// -----------------------------------------------------------------------------
// Template for banner to add to file headers
// -----------------------------------------------------------------------------

var pkg = require('./package.json'),
    banner = {
      full :
        '/*!\n' +
        ' * <%= pkg.name %> v<%= pkg.version %>: <%= pkg.description %>\n' +
        ' * (c) ' + new Date().getFullYear() + ' <%= pkg.author %>\n' +
        ' * <%= pkg.license %> License\n' +
        ' * <%= pkg.repository.url %>\n' +
        ' */\n\n',
      min :
        '/*!' +
        ' <%= pkg.name %> v<%= pkg.version %>' +
        ' | (c) ' + new Date().getFullYear() + ' <%= pkg.author %>' +
        ' | <%= pkg.license %> License' +
        ' | <%= pkg.repository.url %>' +
        ' */\n'
    };


// -----------------------------------------------------------------------------
// Clean
// -----------------------------------------------------------------------------

gulp.task('clean', function () {
  return gulp.src(['./web/images'], {read: false})
    .pipe(plugins.clean());
});

// -----------------------------------------------------------------------------
// Compilation SASS
// -----------------------------------------------------------------------------

gulp.task('styles', function () {
  return gulp.src(paths.styles.input)
  // Source Maps initializations
    .pipe(plugins.sourcemaps.init())

    // Sass & Error
    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))

    // Autoprefixer
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 1%']
      //cascade: true
    }))

    // Concatenation
    .pipe(plugins.concat('style.css'))

    // Header Full
    .pipe(plugins.header (banner.full, { pkg : pkg }))

    // Save it all in ./web/css/ Without Minification
    .pipe(gulp.dest(paths.styles.output))

    // Rename the file to .min.css
    .pipe(plugins.rename({
      basename: "style",
      suffix: ".min"
    }))

    // Minifie the CSS file
    .pipe(plugins.cleanCss({
      compatibility: 'ie8',
      keepSpecialComments : 0
    }))

    // Header Min
    .pipe(plugins.header (banner.min, { pkg : pkg }))

    // Source Maps
    .pipe(plugins.sourcemaps.write('.'))

    // Moving files in our final folder
    .pipe(gulp.dest(paths.styles.output))

    // Livereload
    .pipe(plugins.livereload());
});

// -----------------------------------------------------------------------------
// Javascript
// -----------------------------------------------------------------------------
gulp.task('scripts', function () {
  return gulp.src(paths.scripts.input)
  // Source Maps initializations
    .pipe(plugins.sourcemaps.init())

    // Detect errors and potential problems in JavaScript code
    .pipe(plugins.plumber())

    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))

    // Concatenation
    .pipe(plugins.concat('style.js'))

    // Header Full
    .pipe(plugins.header (banner.full, { pkg : pkg }))

    // Save it all in ./web/js/ Without Minification
    .pipe(gulp.dest(paths.scripts.output))

    // Rename the file to .min.js
    .pipe(plugins.rename({
      basename: "style",
      suffix: ".min"
    }))

    // Minifie the CSS file
    .pipe(plugins.uglify())

    // Header Min
    .pipe(plugins.header (banner.min, { pkg : pkg }))

    // Source Maps
    .pipe(plugins.sourcemaps.write('.'))

    // Moving files in our final folder
    .pipe(gulp.dest(paths.scripts.output))

    // Livereload
    .pipe(plugins.livereload());

});


// -----------------------------------------------------------------------------
// Images
// -----------------------------------------------------------------------------

gulp.task('images', ['clean'], function () {
  return gulp.src('./MySrc/images/**/*')
  // Images optimization
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('./web/images'))

    // Livereload
    .pipe(plugins.livereload());
});


// -----------------------------------------------------------------------------
// Iconfont
// -----------------------------------------------------------------------------

gulp.task('iconfont', function () {
  console.log('iconfont');
});


// -----------------------------------------------------------------------------
// Livereload
// -----------------------------------------------------------------------------

gulp.task('listen', function () {
  plugins.livereload.listen();

  gulp.watch(['*.html', '*.php']).on('change', function(event) {
    plugins.livereload.changed(event.path)
  })

});


// -----------------------------------------------------------------------------
// Default
// -----------------------------------------------------------------------------

gulp.task('default', [
  'styles',
  'scripts',
  'images'
]);


// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

gulp.task('watch', ['listen', 'default'], function () {

  gulp.watch('./MySrc/styles/**/*.scss', ['styles']);
  gulp.watch('./MySrc/scripts/**/*.js', ['scripts']);

});


