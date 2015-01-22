module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.initConfig({
        nodewebkit: {
            options: {
                appName: 'Spotify Server',
                platforms: ['osx32'],
                buildDir: './builds',
                macIcns: 'server.icns',
                macZip: false,
                files: [ "package.json",  "./**/*"],
                version: '0.8.6'
            },
            src: ['./**/*']
        }
    });
}
