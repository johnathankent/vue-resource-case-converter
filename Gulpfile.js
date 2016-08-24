const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglifyjs');
const rename = require('gulp-rename');
 
gulp.task('default', () => {
    return gulp.src('index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('vue-resource-case-converter.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('vue-resource-case-converter.min.js'))
        .pipe(gulp.dest('dist'));
});
