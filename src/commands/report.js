const gulp = require("gulp");
const inlineSource = require("gulp-inline-source-html");
const replace = require("gulp-replace");
const { exec } = require('@dhis2/cli-helpers-engine')
const concat = require("gulp-concat");
const concatCss = require('gulp-concat-css');

const handler = async () => {
    const baseUrl = process.env.DHIS2_BASE_URL || "..";

    await exec({
        cmd: 'npx d2-app-scripts',
        args: ['build'],
        cwd: process.cwd(),
        env: { ...process.env, DHIS2_BASE_URL: baseUrl, INLINE_RUNTIME_CHUNK: false, GENERATE_SOURCEMAP: false, SKIP_PREFLIGHT_CHECK: true },
        pipe: false,
    })

    // Bundle all js chunks into a single file
    gulp.task("bundle-js", () =>
        gulp
            .src("./build/app/static/**/*.js")
            .pipe(concat("main.js"))
            .pipe(gulp.dest("./build/app/static/js"))
    );

    // Bundle all css chunks into a single file
    gulp.task("bundle-css", () =>
        gulp
            .src("./build/app/static/**/*.css")
            .pipe(concatCss("main.css"))
            .pipe(gulp.dest("./build/app/static/css"))
    );

    // Inline all css and js files
    gulp.task("inline", () =>
        gulp
            .src("./build/app/*.html")
            .pipe(
                replace(
                    /\<script.*\<\/script\>/g,
                    `<script src="./static/js/main.js" inline></script>`
                )
            )
            .pipe(replace(/\<link.*rel\=\"stylesheet\"\>/g, `<link href="./static/css/main.css" rel="stylesheet" inline>`))
            .pipe(inlineSource({ compress: false, ignore: ["png"] }))
            .pipe(gulp.dest("./build/bundle"))
    );

    await gulp.series("bundle-js", "bundle-css", "inline")();
};

module.exports = {
    command: "report",
    desc: "Bundle a report",
    aliases: "r",
    handler,
};
