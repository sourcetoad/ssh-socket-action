const core = require('@actions/core');

const { execSync } = require('child_process');

const host = core.getInput('host');
const port = core.getInput('port');
const socketPath = core.getInput('socket-path');
const key = core.getInput('key');
const lifetimeInSeconds = core.getInput('lifetime');

// Create random socket path, if none passed.
if (!socketPath) {
    try {
        execSync('mktemp -u', {encoding: 'utf-8'})
    } catch (e) {
        core.setFailed(e.message);
        process.exit(1);
    }
}

console.log(`Attempting to create ${socketPath}...`);

// Prepare the host file.
execSync('mkdir -p ~/.ssh');
execSync('touch ~/.ssh/known_hosts');
execSync(`sed -i -e '/^${host} /d' ~/.ssh/known_hosts`);
execSync(`ssh-keyscan${port ? ` -p ${port}` : ''} "${host}" >> ~/.ssh/known_hosts`);

// Start the agent (or re-use one)
try {
    execSync(`ssh-agent -a "${socketPath}"`)
} catch (e) {
    if (e.message.includes('Address already in use')) {
        core.info('Agent already exists on sock. Skipping creation.');
    } else {
        core.setFailed(e.message);
        process.exit(1);
    }
}

// Pluck the pid and set values (if possible)
try {
    const pid = parseInt(execSync(`fuser ${socketPath} 2> /dev/null`, {encoding: 'utf-8'}));
    core.exportVariable('SSH_AGENT_PID', pid);
    core.setOutput('agent-pid', pid);
} catch (e) {
    core.warning('PID capture failed (fuser). Skipping...');
}

// Add the key and set outputs
core.exportVariable('SSH_AUTH_SOCK', socketPath);
core.setOutput('socket-path', socketPath);
execSync(`echo "${key}" | base64 -d | ssh-add -t ${lifetimeInSeconds} -`);
core.info('Done; exiting.');
