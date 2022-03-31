const core = require('@actions/core');
const io = require('@actions/io');
const exec = require('@actions/exec');

const host = core.getInput('host');
const port = core.getInput('port');
const socketPath = core.getInput('socket-path');
const key = core.getInput('key');
const lifetimeInSeconds = core.getInput('lifetime_in_seconds');

async function run() {
    core.info('checking if ~/.ssh is created...');
    await io.mkdirP('~/.ssh');

    core.info(`remove the prior known_hosts for ${host}.`)
    await exec.exec('sed', ['-i', '-e', `/^${host} /d`, '~/.ssh/known_hosts']);

    core.info('ssh-keyscan: add the provided domain...');
    let portCommand = port ? `-p ${port}` : '';
    await exec.exec('ssh-keyscan', [portCommand, host, '>> ~/.ssh/known_hosts']);

    core.info(`Attempting to create if not found. ${socketPath}...`);
    await exec
        .exec(`eval $(ssh-agent -a "${socketPath}")`)
        .catch(function (reason) {
            // TODO - Catch specific error
        });

    core.info('Attempting to add key to agent...');
    await exec.exec(`echo "${key}" | base64 -d | ssh-add -t ${lifetimeInSeconds} -`);

    core.info(`Created ${socketPath}`);
    core.setOutput('socket-path', socketPath);
    core.info('Done; exiting.');
}

run();
