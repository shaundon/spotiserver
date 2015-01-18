module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.initConfig({
        nodewebkit: {
            options: {
                appName: 'Spotify Remote',
                platforms: ['osx'],
                buildDir: './builds',
                macIcns: 'client.icns',
                macZip: false,
                files: [ "package.json",  "./**/*"]
            },
            src: ['./**/*']
        }
    });
};
