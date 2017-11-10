const spawn = require('child_process').spawn;


module.exports = (grunt) => {
  // helper to run async command
  const runCmd = (cmd, args, options) => new Promise((resolve) => {
    grunt.log.write(`${cmd} ${args.join(" ")}\n`);
    const ls = spawn(process.platform === 'win32' ? `${cmd}.cmd` : cmd, args, options);
    ls.stdout.on('data', data => grunt.log.write(data));
    ls.stderr.on('data', data => grunt.log.error(data));
    ls.on('exit', code => grunt.log.ok(`Child process exited with code ${code}`) && resolve());
  });

  // fetch all files we want to ignore
  const eslintignore = grunt.file
    .read(".eslintignore").split("\n")
    .map(e => e.trim())
    .filter(e => e !== "" && !e.startsWith("#"))
    .map(e => `!${e}`);

  // init project config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      options: {
        configFile: 'conf/eslint.json',
        rulePaths: ['conf/rules'],
        maxWarnings: 0
      },
      target: [
        '**'
      ].concat(eslintignore)
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
            'Gruntfile.js',
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

  // update and install all npm dependencies
  // eslint-disable-next-line func-names
  grunt.registerTask('update', function () {
    const cb = this.async();
    runCmd('ncu', ['-u', '--packageFile', `package.json`])
      .then(() => runCmd('npm', ['prune']))
      .then(() => runCmd('npm', ['install']))
      .then(() => cb);
  });
};
