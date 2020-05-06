# SSH Socket Setup GitHub Action
Setup an SSH socket with a private key.

## Usage
### Inputs
#### `host`
**Required** Remote hostname

#### `socket-path`
**Required** Path at which to create socket.

#### `key`
**Required** SSH private key as base64

Base64 encode your key:

    openssl base64 -in {PRIVATE_KEY_FILE} -out {OUTPUT_PRIVATE_KEY_FILE}
    
You can store this in your GitHub Secrets to be referenced in your workflow when using this action.


### Outputs
#### `socket-path`
Path at which socket was created.

### Example usage
    - name: SSH Socket Setup
      id: ssh-socket-action
      uses: sourcetoad/ssh-socket-action@v1.0.0
      with:
        host: github.com
        socket-path: /tmp/ssh_agent.sock
        key: {BASE64_SECRET_KEY}

    - name: Use SSH socket
      run: ls -l "${{ steps.ssh-socket-action.outputs.socket-path }}"
        
## Development
Make `ncc` available in your build environment:

    npm i -g @zeit/ncc
    
Install package dependencies:

    yarn install
    
Build `dist/index.js`:

    ncc build index.js

### Install as Local Action
For quicker troubleshooting cycles, the action can be copied directly into another project. This way, changes to the action and it's usage can happen simultaneously, in one commit.

1. Copy this repository into your other project as `.github/actions/ssh-socket-action`. Be careful: simply cloning in place will likely install it as a submodule--make sure to copy the files without `.git`
2. In your other project's workflow, in the action step, set\
`uses: ./.github/actions/ssh-socket-action`
3. When making changes to the local action, make sure to rebuild `dist` and commit it
