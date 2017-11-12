module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    gardener: {
      this: {}
    }
  });

  grunt.registerMultiTask('gardener', 'Execute various tests for your project.', () => {
    const loadConfig = name => grunt.file
      .read(`conf/${name}`).split("\n")
      .map(e => e.split("#", 1)[0].trim())
      .filter(e => e !== "");

    const gruntRunner = (task, cfg) => {
      const cfgOriginal = grunt.config.getRaw();
      grunt.config.set(task, cfg);
      grunt.task.run(task);
      grunt.config.init(cfgOriginal);
    };

    grunt.loadNpmTasks('grunt-project-update');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-yamllint');
    grunt.loadNpmTasks('grunt-depcheck');
    grunt.loadNpmTasks('grunt-check-dependencies');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    const tasks = {
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
        this: [
          '**'
        ].concat(loadConfig(".eslintignore").map(e => `!${e}`))
      },
      yamllint: {
        options: {
          schema: 'DEFAULT_SAFE_SCHEMA'
        },
        this: grunt.file.expand([
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
          ignoreMatches: loadConfig(".depunusedignore")
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
            excludes: loadConfig(".coverignore"),
            mochaOptions: ['--sort'],
            istanbulOptions: ['--include-all-sources', '--default-excludes=false'],
            root: './'
          },
          reportFormats: ['lcov', 'cobertura', 'lcovonly']
        }
      }
    };
    Object.keys(tasks).forEach(k => gruntRunner(k, tasks[k]));
  });
};
