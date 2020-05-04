const core = require('@actions/core');
const github = require('@actions/github');

const { exec } = require('child_process');

const host = core.getInput('host');
const socketPath = core.getInput('socket-path');
const key = core.getInput('key');

console.log(`Attempting to create ${socketPath}...`);
exec(
    'mkdir ~/.ssh && ' +
        `ssh-keyscan "${host}" >> ~/.ssh/known_hosts && ` +
        `ssh-agent -a "${socketPath}" > /dev/null && ` +
        `echo "${key}" | base64 -d | ssh-add - && ` +
        `ls -l "${socketPath}"`,
    {stdio: 'inherit'}
);

console.log(`Created ${socketPath}`);
core.setOutput('socket-path', socketPath);

console.log('Done; exiting.');
