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
    depcheck: {
      options: {
        withoutDev: false,
        failOnUnusedDeps: true,
        failOnMissingDeps: true,
        listMissing: true,
        ignoreDirs: ['.git', '.svn', '.hg', '.idea', 'node_modules', 'bower_components'],
        ignoreMatches: [
          'babel-eslint',
          'eslint-config-airbnb-base',
          'eslint-plugin-import', // used by airbnb
          'eslint-plugin-jasmine',
          'eslint-plugin-json',
          'eslint-plugin-mocha',
          'istanbul',
          'mocha'
        ]
      },
      this: [
        '.'
      ]
    },
    checkDependencies: {
      this: {
        options: {
          packageManager: 'npm',
          packageDir: '.',
          onlySpecified: false,
          install: false,
          continueAfterInstall: false
        }
      }
    },
    mocha_istanbul: {
      this: {
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

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-yamllint');
  grunt.loadNpmTasks('grunt-depcheck');
  grunt.loadNpmTasks('grunt-check-dependencies');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('test', ['eslint', 'yamllint', 'depcheck', 'checkDependencies', 'mocha_istanbul']);
};
