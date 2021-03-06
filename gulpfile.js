var gulp = require('gulp'),
	path = require('path'),
	jshintReporter = require('jshint-stylish'),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	});

var path = {
	src: {
		files: 'src/**/*.js'
	}
};

gulp.task('jshint', function(done) {
	gulp.src(path.src.files)
	.pipe(plugins.jshint('.jshintrc'))
	.pipe(plugins.jshint.reporter(jshintReporter));
	done();
});

gulp.task('build', function() {
	var pkg = require('./package.json');

	var header = ['/**',
		' * <%= pkg.name %>',
		' * <%= pkg.description %>',
		' * @version v<%= pkg.version %>',
		' * @author <%= pkg.author%>',
		' * @link <%= pkg.homepage %>',
		' * @license <%= pkg.license %>',
		' */',
		'(function (angular) {',
		'',
		''].join('\n');

	var footer = [
		'',
		'})(angular);',
		''].join('\n');

	gulp.src([
		'src/ng-virtual-keyboard.js'
	])
	.pipe(plugins.concat('ng-virtual-keyboard.js'))
	.pipe(plugins.header(header, {pkg: pkg}))
	.pipe(plugins.footer(footer))
	.pipe(gulp.dest('./dist/'))
	.pipe(plugins.uglify())
	.pipe(plugins.concat('ng-virtual-keyboard.min.js'))
	.pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['jshint', 'build'], function() {
	gulp.watch(path.src.files, ['jshint', 'build']);
});

gulp.task('changelog', function(done) {
	var pkg = require('./package.json');
	var changelog = require('conventional-changelog');
	var fs = require('fs');

	var options = {
		repository: pkg.homepage,
		version: pkg.version,
		file: 'CHANGELOG.md'
	};

	var filePath = './' + options.file;
	changelog(options, function(err, log) {
		if (err) {
			throw err;
		}

		fs.writeFile(filePath, log, done);
	});
});
