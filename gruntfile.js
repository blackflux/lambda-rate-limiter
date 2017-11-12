module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      options: {
        configFile: 'conf/eslint.json',
        rulePaths: ['conf/rules'],
        maxWarnings: 0
      },
      target: [
        '**',
        '!node_modules/**',
        '!coverage/**',
        '!README.md',
        '!LICENSE'
      ]
    },
    yamllint: {
      options: {
        schema: 'DEFAULT_SAFE_SCHEMA'
      },
      all: ['**/*.yml', '**/*.yaml', '.*.yml', '.*.yaml']
    },
    mocha_istanbul: {
      coverage: {
        src: [
          'tests/*.js'
        ],
        options: {
          check: {
            lines: 100,
            statements: 100,
            branches: 100,
            functions: 100
          },
          excludes: [
            'gruntfile.js',
            'conf/rules/*.js',
            '**/node_modules/**'
          ],
          mochaOptions: ['--sort'],
          istanbulOptions: ['--include-all-sources', '--default-excludes=false'],
          root: './'
        },
        reportFormats: ['lcov', 'cobertura', 'lcovonly']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-yamllint');

  grunt.registerTask('test', ['eslint', 'yamllint', 'mocha_istanbul:coverage']);
};
