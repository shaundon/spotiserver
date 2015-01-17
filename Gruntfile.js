module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.initConfig({
        nodewebkit: {
            options: {
                platforms: ['osx'],
                buildDir: './builds',
                macIcns: 'icon.icns',
                macZip: false,
                files: [ "package.json",  "./**/*"]
            },
            src: ['./**/*']
        }
    });
}
