module.exports = function(grunt) {

  // Configuration goes here
  grunt.initConfig({
  	pkg: grunt.file.readJSON("package.json"),
  	clean: {
  		build: {
  			src: ['prod']
  		}
  	},
  	copy: {
  		build: {
  			cwd: 'dev',
  			src: ['**', '!**/*.scss'],
  			dest: 'prod',
  			expand: true
  		}
  	},
  	sass: {
      build: {
        files: [{
          expand: true,
          cwd: 'dev/styles',
          src: ['**/*.scss'],
          dest: 'prod/styles',
          ext: '.css'
        }],
      }
  	},
  	watch: {
    		sass: {
    			files: ['dev/styles/*.scss'],
    			tasks: ['sass']
    		},
    		copy: {
    			files: ['dev/**', '!dev/**/*.scss', '!dev/libraries/**'],
    			tasks: ['copy']
    		}
  	}
  });

  // Load plugins here
  grunt.loadNpmTasks('grunt-contrib');

  // Define your tasks here
  grunt.registerTask('stylesheets',['sass']);
  grunt.registerTask('cleanup',['clean']);
  grunt.registerTask('default-watch'['default','watch'])
  grunt.registerTask('default',['cleanup','copy','stylesheets']);
};