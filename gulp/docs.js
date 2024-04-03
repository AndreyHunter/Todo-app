const gulp = require('gulp');

// HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');

// CSS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');

// Images
const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html');
const webpCss = require('gulp-webp-css');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const changed = require('gulp-changed');

const fileIncludeNotify = {
	prefix: '@@',
	basepath: '@file',
};

const serverNotify = {
	livereload: true,
	open: true,
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

function plumberNotify(title) {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
}

gulp.task('clean:docs', function (done) {
	if (fs.existsSync('./docs/')) {
		return gulp.src('./docs/', { read: false }).pipe(clean({ force: true }));
	}
	done();
});

gulp.task('copyJson:docs', function () {
	return gulp
		.src('./src/data/**/*.json')
		.pipe(plumber(plumberNotify('JSON:docs')))
		.pipe(gulp.dest('./docs/data'));
});

gulp.task('html:docs', function () {
	return (
		gulp
			.src(['./src/pages/**/*.html', '!./src/pages/html/*.html'])
			.pipe(changed('./docs/'))
			.pipe(plumber(plumberNotify('HTML')))
			.pipe(fileInclude(fileIncludeNotify))
			// .pipe(webpHTML())
			.pipe(htmlclean())
			.pipe(gulp.dest('./docs/'))
	);
});

gulp.task('sass:docs', function () {
	return (
		gulp
			.src('./src/scss/*.scss')
			.pipe(changed('./docs/css/'))
			.pipe(plumber(plumberNotify('SCSS')))
			.pipe(sourceMaps.init())
			.pipe(sassGlob())
			// .pipe(webpCss())
			.pipe(groupMedia())
			.pipe(sass())
			.pipe(autoprefixer())
			.pipe(csso())
			.pipe(sourceMaps.write())
			.pipe(gulp.dest('./docs/css/'))
	);
});

gulp.task('js:docs', function () {
	return gulp
		.src('./src/js/*.js')
		.pipe(changed('./docs/js/'))
		.pipe(plumber(plumberNotify('JS')))
		.pipe(babel())
		.pipe(webpack(require('../webpack.config.js')))
		.pipe(gulp.dest('./docs/js/'));
});

gulp.task('images:docs', function () {
	return gulp
		.src('./src/images/**/*')
		.pipe(changed('./docs/images/'))
		.pipe(webp())
		.pipe(gulp.dest('./docs/images/'))

		.pipe(gulp.src('./src/images/**/*'))
		.pipe(changed('./docs/images/'))
		.pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest('./docs/images/'));
});

// gulp.task('svgStack:docs', function() {
//     return gulp
//         .src('./src/images/svg**/*.svg')
//         .pipe(plumber(plumberNotify('SVG:docs')))
//         .pipe(svgSprite(svgStack))
//         .pipe(gulp.dest('./docs/images/svg/'))
// })

gulp.task('svgSymbol:docs', function () {
	return gulp
		.src('./src/images/svgicons/**/*.svg')
		.pipe(plumber(plumberNotify('SVG:docs')))
		.pipe(svgSprite(svgSymbol))
		.pipe(gulp.dest('./docs/images/svgsprite/'));
});

gulp.task('fonts:docs', function () {
	return gulp
		.src('./src/fonts/**/*')
		.pipe(changed('./docs/fonts/'))
		.pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('server:docs', function () {
	return gulp.src('./docs/').pipe(server(serverNotify));
});
