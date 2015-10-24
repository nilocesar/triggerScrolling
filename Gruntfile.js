module.exports = function (grunt) {
	"use strict";

	var banner;

	banner = "/*\n" +
		" * <%= pkg.title %> v<%= pkg.version %>\n" +
		" *\n" +
		" * <%= pkg.homepage %>\n" +
		" *\n" +
		" * Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
		" * Released under the <%= _.pluck(pkg.licenses, 'type').join(', ') %> license\n" +
		" */\n";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		watch: {
			config: {
				files: ['gruntfile.js', 'package.json'],
				reload: true
			},
			scripts: {
				files: ['libs/src/*.js'],
				tasks: ['concat', 'jshint'],
				options: {
					spawn: false,
				},
			},
		},

		concat: {
			dist: {
				options: {
					banner: banner
				},
				files: {
					"libs/dist/<%= pkg.plugin.name %>-<%= pkg.version %>.js": "libs/src/<%= pkg.plugin.name %>.js"
				}
			},
			extra: {
				options: {
					banner: banner
				},
				files: {
					"libs/dist/<%= pkg.plugin.additional %>-<%= pkg.version %>.js": "libs/src/<%= pkg.plugin.additional %>.js"
				}
			}
		},

		uglify: {
			options: {
				mangle: true,
				beautify: false,
				preserveComments: true,
				report: 'gzip',
				compress: {
					drop_console: false
				}
			},
			dist: {
				files: {
					"libs/dist/<%= pkg.plugin.name %>-<%= pkg.version %>.min.js": "libs/dist/<%= pkg.plugin.name %>-<%= pkg.version %>.js"
				}
			}
		},

		jshint: {
			all: ['Gruntfile.js', 'libs/src/*.js'],
			options: {
				'-W030': true,
			},
		},

		clean: {
			build: ["libs/dist/*"]
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['jshint', 'clean', 'concat', 'uglify']);
};