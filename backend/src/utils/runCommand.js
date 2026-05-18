const { execSync } = require('child_process');

const runCommand = (command, cwd) => {
  execSync(command, {
    cwd,
    stdio: 'inherit',
    env: process.env,
  });
};

module.exports = runCommand;
