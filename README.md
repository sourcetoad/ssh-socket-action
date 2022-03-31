# SSH Socket Setup GitHub Action
Setup an SSH socket with a private key.

## Usage
### Inputs

Following inputs can be used as `step.with` keys

| Name          | Required | Type   | Description                        |
|---------------|----------|--------|------------------------------------|
| `host`        | Yes      | String | Remote hostname.                   |
| `port`        | No       | Number | SSH Port (default: `22`).          |
| `socket-path` | Yes      | String | Path at which to create socket.    |
| `key`         | Yes      | String | base64 private key                 |
| `lifetime`    | No       | Number | Seconds to keep key (default: 600) |

You may encode your private key in base64 via:

```shell
openssl base64 -in {PRIVATE_KEY_FILE} -out {OUTPUT_PRIVATE_KEY_FILE}
```
    
Store that in GitHub Secrets to securely pass to the action.

### Outputs
| Name          | Description                      |
|---------------|----------------------------------|
| `socket-path` | Path at which socket was created |
| `agent-pid`   | SSH Agent PID.                   |

### Example usage
```yaml
- name: SSH Socket Setup
  id: ssh-socket-action
  uses: sourcetoad/ssh-socket-action@v1.0.0
  with:
      host: github.com
      port: 22 # optional
      socket-path: /tmp/ssh_agent.sock
      key: ${{ secrets.BASE64_SECRET_KEY }}

- name: Use SSH socket
  run: ls -l "${{ steps.ssh-socket-action.outputs.socket-path }}"
```

## Development
Make `ncc` available in your build environment:
```shell
npm i -g @vercel/ncc
```
    
Install package dependencies:
```shell
yarn install
```
    
Build `dist/index.js`:
```shell
ncc build index.js
```
---

### Install as Local Action
For quicker troubleshooting cycles, the action can be copied directly into another project. This way, changes to the action and it's usage can happen simultaneously, in one commit.

1. Copy this repository into your other project as `.github/actions/ssh-socket-action`. Be careful: simply cloning in place will likely install it as a submodule--make sure to copy the files without `.git`
2. In your other project's workflow, in the action step, set\
`uses: ./.github/actions/ssh-socket-action`
3. When making changes to the local action, make sure to rebuild `dist` and commit it
