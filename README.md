# SSH Socket Setup GitHub Action
Setup an SSH socket with a private key.

## Inputs
### `host`
**Required** Remote hostname

### `socket-path`
**Required** Path at which to create socket.

### `key`
**Required** SSH private key

## Outputs
### `socket-path`
Path at which socket was created.

## Example usage
    - name: SSH Socket Setup
      id: ssh-socket-action
      uses: ./.github/actions/ssh-sock-setup
      with:
        host: github.com
        socket-path: /tmp/ssh_agent.sock
        key: BASE64_SECRET_KEY

    - name: Use SSH socket
      run: |
        ls -l "${{ steps.ssh-socket-action.outputs.socket-path }}"
