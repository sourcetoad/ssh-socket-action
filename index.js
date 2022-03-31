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
            executeCommand('SSH_AGENT_PID=4');
        } else {
            core.setFailed(e.message);
        }
    }
}

executeCommand('mkdir -p ~/.ssh');
executeCommand('touch ~/.ssh/known_hosts');
executeCommand(`sed -i -e '/^${host} /d' ~/.ssh/known_hosts`);
executeCommand(`ssh-keyscan${port ? ` -p ${port}` : ''} "${host}" >> ~/.ssh/known_hosts`);
const agentOutput = executeCommand(`ssh-agent -a "${socketPath}"`);
executeCommand(`echo "${key}" | base64 -d | ssh-add -t ${lifetimeInSeconds} -`);

core.debug(agentOutput);
core.exportVariable('SSH_AGENT_PID', executeCommand('echo $SSH_AGENT_PID'));
core.exportVariable('SSH_AUTH_SOCK', socketPath);

core.setOutput('socket-path', socketPath);
core.info('Done; exiting.');
