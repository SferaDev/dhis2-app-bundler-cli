const gulp = require("gulp");
const inlineSource = require("gulp-inline-source-html");
const replace = require("gulp-replace");
const { execSync } = require("child_process");
var concat = require("gulp-concat");

const handler = async () => {
    const baseUrl = process.env.DHIS2_BASE_URL || "..";
    execSync("d2-app-scripts build", {
        env: {
            ...process.env,
            DHIS2_BASE_URL: baseUrl,
        },
    });

    gulp.task("bundle", () =>
        gulp
            .src("./build/app/static/**/*.js")
            .pipe(concat("main.js"))
            .pipe(gulp.dest("./build/app/static/js"))
    );

    gulp.task("inline", () =>
        gulp
            .src("./build/app/*.html")
            .pipe(
                replace(
                    /\<script.*\<\/script\>/g,
                    `<script src="./static/js/main.js" inline></script>`
                )
            )
            .pipe(replace('rel="stylesheet">', 'rel="stylesheet" inline>'))
            .pipe(inlineSource({ compress: false, ignore: ["png"] }))
            .pipe(gulp.dest("./build/bundle"))
    );

    await gulp.series("bundle", "inline")();
};

module.exports = {
    command: "report",
    desc: "Bundle a report",
    aliases: "r",
    handler,
};
