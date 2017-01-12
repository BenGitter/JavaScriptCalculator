var gulp = require("gulp");
var bs = require("browser-sync").create();

gulp.task("browser-sync", function(){
    bs.init({
        server: {
            baseDir: "./"
        }
    })
});

gulp.task("default", ["browser-sync"], function(){
    gulp.watch(["./*"], bs.reload);
});