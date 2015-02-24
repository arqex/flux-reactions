var gulp = require('gulp'),
	fs = require('fs'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	insert = require('gulp-insert')
;

var packageName = 'flux-reactions';

var pack = require( './package.json' );

var getDate = function(){
	var now = new Date();
	return now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear();
}

var cr = '/* ' + packageName + ' v' + pack.version + ' (' + getDate() + ')\n';
cr += ' * ' + pack.repository.url + '\n';
cr += ' * By arqex\n * License: ' + pack.license + '\n */\n';

gulp.task( 'build', function(){

	gulp.src('./src/flux-reactions.js')
		.pipe( insert.prepend( cr ))
		.pipe( gulp.dest( './') )
	;

	gulp.src('./src/flux-reactions.js')
		.pipe( uglify() )
		.pipe( rename( packageName + '.min.js' ))
		.pipe( insert.prepend( cr ))
		.pipe( gulp.dest('./') )
	;
});

gulp.task( 'default', ['build'] );