"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var del = require('del');
var run = require("run-sequence");
var imagemin = require("gulp-imagemin");

gulp.task("css", function () {
    return gulp.src("source/scss/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
});

gulp.task("server", ['css', 'html'], function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/scss/**/*.scss", ["css"]);
    gulp.watch("source/*.html", ["html"]).on("change", server.reload);
});

gulp.task("html", function () {
    return gulp.src("source/*.html")
        .pipe(gulp.dest("build"));
});

gulp.task("clear", function () {
    return del("build");
});

gulp.task("images", function () {
    return gulp.src("source/images/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("build/img"));
});

gulp.task("build", function (done) {
    run(
        "clear",
        "css",
        "images",
        "html",
        "fonts",
        done
    )
});

gulp.task("fonts", function () {
    return gulp.src("source/fonts/*.{woff,woff2,ttf}")
        .pipe(gulp.dest("build/fonts"));
});