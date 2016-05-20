var gulp = require('gulp'),
    
    // gulp dependencies
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    
    rename = require('gulp-rename'),
    del = require('del'),
    copy = require('gulp-copy'),
    path = require('path')
;

// 配置文件路径
var paths = {
    dist: {
        minified: 'dist/minified',
        uncompressed: 'dist/uncompressed',
        packaged: 'dist/packaged',
    },
};

// 压缩js
gulp.task('minifyjs', function(){
    return gulp.src(['src/js/*.js', 'src/js/**/*.js'])
            // 语法检查
            //.pipe(jshint())
            //.pipe(jshint.reporter('default'))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(paths.dist.minified + '/javascript'));
});

// 合并,压缩js
gulp.task('packagejs', function(){
    
    // jquery plugins
    gulp.src([paths.dist.minified + '/javascript/*.js'])
        .pipe(concat('bundle.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));

    gulp.src([
        paths.dist.minified + '/javascript/jquery/jquery.min.js',
        paths.dist.minified + '/javascript/jquery/bootstrap.min.js'
        ])
        .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/javascript'));

});

// 预编译less,压缩css
gulp.task('minifycss', function(){
    // 通过pipe() 把要处理的文件导向插件,通过查找对应插件的api执行对应的命令
    gulp.src(['src/less/bootstrap.less'])
        .pipe(less())
        .pipe(gulp.dest(paths.dist.uncompressed + '/css'))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.minified + '/css'));

    /*gulp.src(['src/less/bootstrap.less'])
        .pipe(less())
        //.pipe(gulp.dest(paths.dist.uncompressed + '/css'))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.minified + '/css'));*/
});

// 合并,压缩css
gulp.task('packagecss', function(){
    // 合并css
    gulp.src(paths.dist.minified + '/css/bootstrap.min.css')
        .pipe(concat('main.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.packaged + '/css'));
});

/*gulp.task('jade', function() {
    return gulp.src('src/css/semantic/semantic.jade')
    .pipe(jade())
    .pipe(gulp.dest(paths.dist.packaged + '/css'));
});*/

// Copy all static images
gulp.task('images', function() {
  return gulp.src(['src/images/*.*', 'src/images/**/*.*'])
    // Pass in options to the task
    .pipe(gulp.dest(paths.dist.packaged + '/images'));
});

// 批量命令
gulp.task('comprass', ['minifycss', 'minifyjs'], function(){
    gulp.start('packagecss', 'packagejs', 'images');
});

// 清理旧文件
gulp.task('clean', function(cb){
    del(['dist/minified', 'dist/uncompressed', 'dist/packaged'], cb); 
});

// 设置默认任务
gulp.task('default', ['clean'], function(){
    gulp.start('minifycss', 'minifyjs');
});

// 监听事件
gulp.task('watch', function(){
    // 监听文件是否修改，以便执行相应的任务
    gulp.watch('src/less/*.less', ['minifycss']);
    gulp.watch('src/js/*.js', ['minifyjs']);
    gulp.watch('src/js/*/*.js', ['minifyjs']);
});
