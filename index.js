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
        return execSync(command, { stdio: 'inherit' }).toString();
    } catch (e) {
        core.info(e);
        if (e.message.contains('Address already in use')) {
            core.info('Agent already exists on sock. Skipping creation.');
        } else {
            core.setFailed(e.message);
        }
    }
}

executeCommand('mkdir -p ~/.ssh');
executeCommand('touch ~/.ssh/known_hosts');
executeCommand(`sed -i -e '/^${host} /d' ~/.ssh/known_hosts`);
executeCommand(`ssh-keyscan${port ? ` -p ${port}` : ''} "${host}" >> ~/.ssh/known_hosts`);
executeCommand(`eval $(ssh-agent -a "${socketPath}")`);
executeCommand(`echo "${key}" | base64 -d | ssh-add -t ${lifetimeInSeconds} -`);

const sshAgentPid = executeCommand('echo $SSH_AGENT_PID');
const sshAgentSock = executeCommand('echo $SSH_AGENT_SOCK');

core.debug(sshAgentPid);
core.debug(sshAgentSock);
core.exportVariable('SSH_AGENT_PID', sshAgentPid);
core.exportVariable('SSH_AGENT_SOCK', sshAgentSock);

core.setOutput('socket-path', socketPath);
core.info('Done; exiting.');
