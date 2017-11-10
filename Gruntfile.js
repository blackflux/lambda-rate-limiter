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
