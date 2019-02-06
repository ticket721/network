# network
Network manager for ticket721

## Env

| Variable | Mandatory | Values | Description |
| :---: | :---: | :---: | :---: |
| `T721_NETWORK` | yes | `test`, `local` | This value will tell every task how it should behave / configure the tools |

## Tasks

| Name | Description |
| :---: | :---------: |
| `network:start` | Start the required network, and writes configuration to portal |
| `network:clean` | Brings down the required network, clean module's portal |
