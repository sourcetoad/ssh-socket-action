const core = require('@actions/core');
const io = require('@actions/io');
const exec = require('@actions/exec');

const host = core.getInput('host');
const port = core.getInput('port');
const socketPath = core.getInput('socket-path');
const key = core.getInput('key');
const lifetimeInSeconds = core.getInput('lifetime_in_seconds');

async function run() {
    console.log('checking if ~/.ssh is created...');
    await io.mkdirP('~/.ssh');

    console.log('ssh-keyscan the provided domain...');
    let portCommand = port ? `-p ${port}` : '';
    await exec.exec('ssh-key', [portCommand, host, '>> ~/.ssh/known_hosts']);

    console.log(`Attempting to create if not found. ${socketPath}...`);
    await exec.exec(`eval $(ssh-agent -a "${socketPath}")`);

    console.log('Attempting to add key to agent...');
    await exec.exec(`echo "${key}" | base64 -d | ssh-add -t ${lifetimeInSeconds} -`);

    console.log(`Created ${socketPath}`);
    core.setOutput('socket-path', socketPath);
    console.log('Done; exiting.');
}

run();
