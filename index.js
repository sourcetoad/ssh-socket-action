const core = require('@actions/core');
const { execSync } = require('child_process');

const host = core.getInput('host');
const port = core.getInput('port');
const key = core.getInput('key');
const lifetimeInSeconds = core.getInput('lifetime');
const shouldPurgeEntry = core.getBooleanInput('purge-entry', {required: false});
let socketPath = core.getInput('socket-path');

// Check if we already have a pid & sock.
const pid = process.env.SSH_AGENT_PID;
const sock = process.env.SSH_AUTH_SOCK;

// Prepare the host file.
execSync('mkdir -p ~/.ssh');
execSync('touch ~/.ssh/known_hosts');

if (pid) {
    core.info('SSH Agent already running. Skipping spawn of ssh-agent...');

    core.exportVariable('SSH_AUTH_SOCK', sock);
    core.setOutput('socket-path', sock);
    core.exportVariable('SSH_AGENT_PID', pid);
    core.setOutput('agent-pid', pid);
} else {
    // Create random socket path, if none passed.
    if (!socketPath) {
        try {
            socketPath = execSync('mktemp -u', {encoding: 'utf-8'}).trim();
        } catch (e) {
            core.setFailed(e.message);
            process.exit(1);
        }
    }

    console.log(`Attempting to create ${socketPath}...`);

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

    core.exportVariable('SSH_AUTH_SOCK', socketPath);
    core.setOutput('socket-path', socketPath);
}

if (shouldPurgeEntry) {
    execSync(`sed -i -e '/^${host} /d' ~/.ssh/known_hosts`);
}
execSync(`ssh-keyscan${port ? ` -p ${port}` : ''} "${host}" >> ~/.ssh/known_hosts`);

execSync(`echo "${key}" | base64 -d | ssh-add -t ${lifetimeInSeconds} -`);
core.info('Done; exiting.');
