const core = require('@actions/core');

const { execSync } = require('child_process');

const host = core.getInput('host');
const port = core.getInput('port');
const socketPath = core.getInput('socket-path');
const key = core.getInput('key');
const lifetimeInSeconds = core.getInput('lifetime_in_seconds');

console.log(`Attempting to create ${socketPath}...`);
try {
    execSync(
        'mkdir -p ~/.ssh && ' +
        'touch ~/.ssh/known_hosts && ' +
        `sed -i -e /^${host} /d ~/.ssh/known_hosts && `
        `ssh-keyscan${port ? ` -p ${port}` : ''} "${host}" >> ~/.ssh/known_hosts && ` +
        `eval $(ssh-agent -a "${socketPath}") && ` +
        `echo "${key}" | base64 -d | ssh-add -t ${lifetimeInSeconds} -`
    );
} catch (e) {
    console.error(e.message);
    process.exit(1);
}

console.log(`Created ${socketPath}`);
core.setOutput('socket-path', socketPath);

console.log('Done; exiting.');
