/**
 * Created by dhayes on 3/29/14.
 */
module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-jade");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-karma");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        karma: {
            unit: {
                configFile: 'karma/karma.conf.js',
                background: true
            },
            continuous: {
                configFile: 'karma/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        less: {
            build: {
                files: {
                    "public/css/app.css": "src/less/app.less",
                    "public/css/dashboard.css": "src/less/dashboard.less",
                    "public/css/app-bootstrap.css": "src/less/app-bootstrap.less"
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    "dist/js/app.js": "<%= concat.app.dest %>",
                    "dist/js/components.js": "<%= concat.components.dest %>"
                }
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true
            },
            target: "<%= concat.app.src %>"
        },
        concat: {
            app: {
                src: ['src/app/**/*.js','!src/app/**/*.spec.js'],
                dest: 'public/js/app.js'
            },
            components: {
                src: 'src/components/**/*.js',
                dest: 'public/js/components.js'
            }
        },
        copy: {
            build: {
                cwd: 'src/images',
                expand: true,
                src: '**/*',
                dest: 'public/images/'
            },
            dist: {
                cwd: 'public',
                expand: true,
                src: '**/*',
                dest: 'dist/'
            }
        },
        clean: {
            build: ['public'],
            dist: ['dist']
        },
        watch: {
            app: {
                files: "<%= concat.app.src %>",
                tasks: "concat:app"
            },
            components: {
                files: "<%= concat.components.src %>",
                tasks: "concat:components"
            },
            less: {
                files: "src/less/**/*.less",
                tasks: "less"
            },
            copy: {
                files: "src/images/**/*",
                tasks: "copy:build"
            },
            karma: {
                files: ['src/app/**/*.js'],
                tasks: ['karma:unit:run']
            }
        }
    });

    grunt.registerTask('build', ['jshint', 'clean:build', 'copy:build', 'less', 'concat']);
    grunt.registerTask('default', ['build', 'karma:unit:start', 'watch']);
    grunt.registerTask('package', ['build', 'clean:dist', 'copy:dist', 'uglify']);
    grunt.registerTask('test', ['build','karma:continuous']);

};