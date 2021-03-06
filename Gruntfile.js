var modulo = 'tanque';
var appPath = '/base';
var baseDir = 'dist/' + modulo;
var baseTemDir = baseDir + '/tmp';


var puerto = 9875;
module.exports = function (grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /**
         * Se encarga de copiar los archivos estaticos al directorio dist.
         */
        copy: {
            css: {
                files: [{
                    cwd: 'src/css',
                    src: '**/*',
                    dest: baseDir + '/css',
                    expand: true
                }]
            },
            img: {
                files: [{
                    cwd: 'src/img',
                    src: '**/*',
                    dest: baseDir + '/img',
                    expand: true
                }]
            },
            partials: {
                files: [{
                    cwd: 'src/partials',
                    src: '**/*',
                    dest: baseDir + '/partials',
                    expand: true
                }]
            },
            base: {
                files: [{
                    cwd: 'src/',
                    src: '*.{html,json}',
                    dest: baseDir,
                    expand: true
                }]
            },
            compile_module: {
                files: [{
                    cwd: 'dist/' + modulo,
                    src: ['**'],
                    dest: '../base/dist/base/module/' + modulo,
                    expand: true
                }]
            },
            generate_dist: {
                files: [{
                    cwd: 'dist/',
                    src: ['**'],
                    dest: 'dist/' + modulo,
                    expand: true
                }]
            }

        },



        /**
         * Se encarga de concatenar los archivos js que pasan en el array de src.
         */
        concat: {
            options: {
                separator: ';'
            },
            tmp: {
                src: [
                    "src/js/main-module-register.js",
                    /*Servicios del modulo*/
                    "src/js/services/**/*.js",
                    /*Controladores del modulo*/
                    "src/js/controllers/home-controller.js",
                    "src/js/controllers/**/*.js",

                    "src/js/app.js",
                    "src/js/setup.js"

                ],

                dest: baseTemDir + '/js/main.js'

            },
            dist: {
                src: [
                    "src/js/main-module-register.js",
                    /*Servicios del modulo*/
                    "src/js/services/**/*.js",
                    /*Controladores del modulo*/
                    "src/js/controllers/home-controller.js",
                    "src/js/controllers/**/*.js",

                    "src/js/app.js",
                    "src/js/setup.js"

                ],

                dest: baseDir + '/js/main.js'

            }
        },

        clean: {
            options: {
                force: true,
                trace: true
            },
            tmpDir: [baseTemDir],
            dist: ['dist'],
        },

        /**
         *
         */
        uglify: {
            options: {
                mangle: false,
                sourceMap: false
            },
            build: {
                files: [{
                    expand: true,
                    cwd: baseTemDir + '/js',
                    src: '**/*js',
                    dest: baseDir + '/js',
                    ext: '.js',
                    extDot: 'last'
                }]
            }
        },

        // levantamos la aplicación

        /**
         * Levanta la aplicación en un servidor propio de desarrollo. Ya define las
         * reglas de proxy para los servicios REST.
         */
        connect: {
            server: {
                options: {
                    hostname: '127.0.0.1',
                    port: puerto,
                    base: ".." + appPath + "/dist",
                    livereload: true,
                    middleware: function (connect, options, defaultMiddleware) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        console.log(proxy)
                        return [proxy].concat(defaultMiddleware);
                    }
                },
                proxies: [{
                    context: '/digi/tanque-m3',
                    host: 'localhost',
                    port: 8080,
                    headers: {
                        'host': 'localhost'
                    }
                }]
            }
        },

        /**
         * Abre una pestaña en el navegador con la url al proyecto
         */
        open: {
            all: {
                // Gets the port from the connect configuration
                path: 'http://localhost:' + puerto + appPath
            }
        },
        /**
         * Se encarga de 'ver' los cambios realizados en los archivos. Cada vez que son realizados
         * cambios se ejecutan las tareas correspondientes.
         */
        watch: {
            html: {
                options: {
                    livereload: true
                },
                files: ['src/partials/**/*.html'],
                tasks: ['partials']
            },
            css: {
                options: {
                    livereload: true
                },
                files: ['src/css/**/*.css'],
                tasks: ['css']
            },
            js: {
                options: {
                    livereload: true
                },
                files: ['src/js/**/*.js'],
                tasks: ['js']
            },
            base: {
                options: {
                    livereload: true
                },
                files: ['src/*.{html,js}'],
                tasks: ['base']
            }


        }

    });
    grunt.registerTask('default', ['build']);
    grunt.registerTask('js', ['concat:dist', 'copy:compile_module', 'clean:tmpDir']);
    grunt.registerTask('base', ['copy:base', 'copy:compile_module', 'clean:tmpDir']);
    grunt.registerTask('partials', ['copy:partials', 'copy:compile_module', 'clean:tmpDir']);
    grunt.registerTask('css', ['copy:css', 'copy:compile_module', 'clean:tmpDir']);
    grunt.registerTask('copyFiles', ['copy:css', 'copy:img', 'copy:partials', 'copy:base']);
    /*Comandos a ejecutar desde consola*/
    grunt.registerTask('deploy', ['copyFiles', 'concat:tmp', 'uglify', 'clean:tmpDir']);
    grunt.registerTask('build', ['copyFiles', 'concat:dist', 'copy:compile_module', 'clean:tmpDir']);
    grunt.registerTask('server', ['build', 'configureProxies:server', "open", 'connect:server', 'watch']);
    grunt.registerTask('reset', ['clean:dist']);


};