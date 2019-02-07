# network
Network manager for ticket721

## Env

| Variable | Mandatory | Values | Description |
| :---: | :---: | :---: | :---: |
| `T721_NETWORK` | yes | `local` | This value will tell every task how it should behave / configure the tools |

## Tasks

| Name | Description |
| :---: | :---------: |
| `network:start` | Start the required network, and writes configuration to portal |
| `network:clean` | Brings down the required network, clean module's portal |

## Network Setup

### Local Network

When using the `local` value for `T721_NETWORK` will run an instance of `ganache-cli` in `docker`.
Then `host`/`port`/`net_id` are written in the `network/` portal directory.

```shell
env T721_NETWORK=local gulp network:start
```

## Network Teardown

You need to set the `T721_NETWORK` value for the submodule to know what to remove.

```shell
env T721_NETWORK=<value> gulp network:clean
```
