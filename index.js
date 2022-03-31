const core = require('@actions/core');

const { execSync } = require('child_process');

const host = core.getInput('host');
const port = core.getInput('port');
const socketPath = core.getInput('socket-path');
const key = core.getInput('key');
const lifetimeInSeconds = core.getInput('lifetime_in_seconds');

console.log(`Attempting to create ${socketPath}...`);

function executeCommand(command) {
    try {
        return execSync(command, {
            encoding: 'utf-8'
        })
    } catch (e) {
        if (e.message.includes('Address already in use')) {
            core.info('Agent already exists on sock. Skipping creation.');
        } else {
            core.setFailed(e.message);
        }
    }
}

// Prepare the host file.
executeCommand('mkdir -p ~/.ssh');
executeCommand('touch ~/.ssh/known_hosts');
executeCommand(`sed -i -e '/^${host} /d' ~/.ssh/known_hosts`);
executeCommand(`ssh-keyscan${port ? ` -p ${port}` : ''} "${host}" >> ~/.ssh/known_hosts`);

// Start the agent (or re-use one)
executeCommand(`ssh-agent -a "${socketPath}"`);
const pid = executeCommand(`lsof -Fp ${socketPath} | head -n 1 | sed 's/^p//'`)
core.exportVariable('SSH_AGENT_PID', parseInt(pid));
core.exportVariable('SSH_AUTH_SOCK', socketPath);

// Add the key
executeCommand(`echo "${key}" | base64 -d | ssh-add -t ${lifetimeInSeconds} -`);

core.setOutput('socket-path', socketPath);
core.info('Done; exiting.');
