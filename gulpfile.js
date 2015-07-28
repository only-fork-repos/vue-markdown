var fs = require("fs"),
    gulp = require('gulp'),
    replace = require("gulp-replace"),
    uglify = require("gulp-uglify"),
    sourcemaps = require("gulp-sourcemaps"),
    del = require("del"),
    rename = require("gulp-rename"),
    header = require("gulp-header")
//模板
var data = fs.readFileSync(__dirname + "/src/template.html", {encoding: "UTF-8"})
var template = JSON.stringify(data)
//头部信息
var pkg = require('./package.json');
var d = new Date()
var date = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDay()
var banner = ["/**", " * Vue Markdown <%=pkg.version%>", " * <%=date%> Peak Tai"
    , " * https://github.com/PeakTai/vue-markdown.git", " */", ""].join("\n")

gulp.task("clean", function () {
    del("dist/*")
})

gulp.task("default", ["clean"], function () {
    return gulp.src("src/vue-markdown.js").pipe(replace("TEMPLATE", template))
        .pipe(header(banner, {pkg: pkg, date: date})).pipe(gulp.dest("dist"))
        .pipe(sourcemaps.init()).pipe(uglify()).pipe(header(banner, {pkg: pkg, date: date}))
        .pipe(rename({extname: ".min.js"})).pipe(sourcemaps.write("./")).pipe(gulp.dest("dist"))
})

