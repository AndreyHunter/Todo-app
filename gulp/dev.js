const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');

// IMAGES
const imagemin = require('gulp-imagemin');
const svgSprite = require('gulp-svg-sprite');

// CSS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');

const fileIncludeNotify = {
	prefix: '@@',
	basepath: '@file',
};

// const svgStack = {
// 	mode: {
// 		stack: {
// 			example: true,
// 		},
// 	},
// 	shape: {
// 		transform: [
// 			{
// 				svgo: {
// 					js2svg: { indent: 4, pretty: true },
// 				},
// 			},
// 		],
// 	},
// };

const svgSymbol = {
	mode: {
		symbol: {
			sprite: '../sprite.symbol.svg',
		},
	},
	shape: {
		transform: [
			{
				svgo: {
					js2svg: { indent: 4, pretty: true },
					plugins: [
						{
							name: 'removeAttrs',
							params: {
								attrs: '(fill|stroke)',
							},
						},
					],
				},
			},
		],
	},
};

const serverNotify = {
	livereload: true,
	open: true,
};

function plumberNotify(title) {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
}

gulp.task('clean:dev', function (done) {
	if (fs.existsSync('./build/')) {
		return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
	}
	done();
});

gulp.task('html:dev', function () {
	return gulp
		.src(['./src/pages/**/*.html', '!./src/pages/html/*.html'])
		.pipe(changed('./build/', { hasChanged: changed.compareContents }))
		.pipe(plumber(plumberNotify('HTML')))
		.pipe(fileInclude(fileIncludeNotify))
		.pipe(gulp.dest('./build/'));
});

gulp.task('sass:dev', function () {
	return gulp
		.src('./src/scss/*.scss')
		.pipe(changed('./build/css/'))
		.pipe(plumber(plumberNotify('SCSS')))
		.pipe(sourceMaps.init())
		.pipe(sassGlob())
		.pipe(groupMedia())
		.pipe(sass())
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('./build/css/'));
});

gulp.task('js:dev', function () {
	return (
		gulp
			.src('./src/js/*.js')
			.pipe(changed('./build/js/'))
			.pipe(plumber(plumberNotify('JS')))
			// .pipe(babel())
			.pipe(webpack(require('../webpack.config.js')))
			.pipe(gulp.dest('./build/js/'))
	);
});

gulp.task('images:dev', function () {
	return (
		gulp
			.src('./src/images/**/*')
			.pipe(changed('./build/images/'))
			// .pipe(imagemin({verbose: true}))
			.pipe(gulp.dest('./build/images/'))
	);
});

// gulp.task('svgStack:dev', function() {
//     return gulp
//         .src('./src/images/svg**/*.svg')
//         .pipe(plumber(plumberNotify('SVG:dev')))
//         .pipe(svgSprite(svgStack))
//         .pipe(gulp.dest('./build/images/svg/'))
// })

gulp.task('copyJson:dev', function () {
	return gulp
		.src('./src/data/**/*.json')
		.pipe(plumber(plumberNotify('JSON:dev')))
		.pipe(gulp.dest('./build/data'));
});

gulp.task('svgSymbol:dev', function () {
	return gulp
		.src('./src/images/svgicons/**/*.svg')
		.pipe(plumber(plumberNotify('SVG:dev')))
		.pipe(svgSprite(svgSymbol))
		.pipe(gulp.dest('./build/images/svgsprite/'));
});

gulp.task('fonts:dev', function () {
	return gulp
		.src('./src/fonts/**/*')
		.pipe(changed('./build/fonts/'))
		.pipe(gulp.dest('./build/fonts/'));
});

gulp.task('server:dev', function () {
	return gulp.src('./build/').pipe(server(serverNotify));
});

gulp.task('watch:dev', function () {
	gulp.watch('./src/**/*.html', gulp.series('html:dev'));
	gulp.watch('./src/scss/**/*.scss', gulp.series('sass:dev'));
	gulp.watch('./src/js/**/*.js', gulp.series('js:dev'));
	gulp.watch('./src/images/**/*', gulp.series('images:dev'));
	gulp.watch('./src/fonts/**/*', gulp.series('fonts:dev'));
	gulp.watch('./src/images/svgicons/*', gulp.series('svgSymbol:dev'));
	gulp.watch('./src/**/*json', gulp.series('copyJson:dev'));
});
