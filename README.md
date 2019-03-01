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
| `network:mine` | Calls the `evm_mine` method for ganache nodes |

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

## Mine on local network

If you need to mine some blocks on a local ganache network, use the following command after starting the network.

```shell
gulp network:mine --block number_of_blocks_to_mine
```
