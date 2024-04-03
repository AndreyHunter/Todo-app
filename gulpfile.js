const gulp = require('gulp');
require('./gulp/dev.js');
require('./gulp/docs.js');

gulp.task(
	'default',
	gulp.series(
		'clean:dev',
		gulp.parallel(
			'html:dev',
			'sass:dev',
			'images:dev',
			'svgSymbol:dev',
			'fonts:dev',
			'js:dev',
			'copyJson:dev',
		),
		gulp.parallel('server:dev', 'watch:dev'),
	),
);

gulp.task(
	'docs',
	gulp.series(
		'clean:docs',
		gulp.parallel(
			'html:docs',
			'sass:docs',
			'images:docs',
			'svgSymbol:docs',
			'fonts:docs',
			'js:docs',
			'copyJson:docs',
		),
		gulp.parallel('server:docs'),
	),
);
