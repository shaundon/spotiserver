module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.initConfig({
        nodewebkit: {
            options: {
                appName: 'Spotify Server',
                platforms: ['osx'],
                buildDir: './builds',
                macIcns: 'server.icns',
                macZip: false,
                files: [ "package.json",  "./**/*"]
            },
            src: ['./**/*']
        }
    });
}
