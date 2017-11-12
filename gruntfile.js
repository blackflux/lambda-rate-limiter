module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    projectUpdate: {
      this: {
        npm: false,
        bower: false,
        commands: [
          { cmd: 'npm', args: ['install'] },
          { cmd: 'npm', args: ['prune'] }
        ]
      }
    },
    eslint: {
      options: {
        configFile: 'conf/eslint.json',
        rulePaths: ['conf/rules'],
        maxWarnings: 0
      },
      target: [
        '**'
      ].concat(grunt.file.read(".eslintignore").split("\n")
        .map(e => e.split("#", 1)[0].trim()).filter(e => e !== "")
        .map(e => `!${e}`))
    },
    yamllint: {
      options: {
        schema: 'DEFAULT_SAFE_SCHEMA'
      },
      all: grunt.file.expand([
        '**/*.yml',
        '**/*.yaml',
        '**/.*.yml',
        '**/.*.yaml',
        '!**/node_modules/**/.*',
        '!**/node_modules/**'
      ])
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

  grunt.loadNpmTasks('grunt-project-update');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-yamllint');
  grunt.loadNpmTasks('grunt-depcheck');
  grunt.loadNpmTasks('grunt-check-dependencies');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('test', [
    'projectUpdate',
    'eslint',
    'yamllint',
    'depcheck',
    'checkDependencies',
    'mocha_istanbul'
  ]);
};
