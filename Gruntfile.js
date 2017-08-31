module.exports = function (grunt) {
    var compilerPath = 'src/lib/closure_compiler';
    // Project configuration
    grunt.initConfig({
        /*
         * Run tests on files change
         */
        watch: {
            test: {
                files: ['src/**.js', 'test/**.js', 'Gruntfile.js'],
                tasks: ['karma:unit'],
                options: {
                    spawn: false
                }
            }
        },
        /*
         * Tests configuration
         */
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        preprocess: {
            all: {
                src: 'src/at-smarttag-jwplayer.js',
                dest: 'working_place/at-smarttag-jwplayer.processed.js',
                options: {
                    inline: true,
                    context: {
                        test: false,
                        debug: false
                    }
                }
            }
        },
        'closure-compiler': {
            simple: {
                closurePath: compilerPath,
                js: 'working_place/at-smarttag-jwplayer.processed.js',
                jsOutputFile: 'dist/at-smarttag-jwplayer.min.js',
                maxBuffer: 500,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            }
        },
        /*
         * Delete work directories
         */
        clean: {
            all: ['dist', 'working_place']
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Tasks
    grunt.registerTask('cleanAll', ['clean:all']);
    grunt.registerTask('unit_test', ['karma:unit', 'watch:test']);
    grunt.registerTask('deliver', ['clean:all', 'preprocess:all', 'closure-compiler:simple']);
};