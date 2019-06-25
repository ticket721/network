const dockerode = require('dockerode');
const signale = require('signale');
const {Portalize} = require('portalize');
const {from_current} = require('../misc');
const Web3 = require('web3');

const Docker = new dockerode();

const GANACHE_IMAGE = 'trufflesuite/ganache-cli:v6.3.0';
const GETH_IMAGE = 'horyus/test-geth:latest';
const HOST_PORT = '8545';
const CONTAINER_NAME = 't721-ethnode';

// Docker pull the geth image
const pull_geth = async () => {
    signale.info(`docker: Pulling ${GETH_IMAGE}`);
    return new Promise((ok, ko) => {
        Docker.pull(GETH_IMAGE, (err, res) => {
            if (err) return ko(err);
            Docker.modem.followProgress(res, () => {
                signale.success(`docker: Pulled ${GETH_IMAGE}`);
                ok();
            });
        });

    })
};

// Docker pull the ganache image
const pull_ganache = async () => {
    signale.info(`docker: Pulling ${GANACHE_IMAGE}`);
    return new Promise((ok, ko) => {
        Docker.pull(GANACHE_IMAGE, (err, res) => {
            if (err) return ko(err);
            Docker.modem.followProgress(res, () => {
                signale.success(`docker: Pulled ${GANACHE_IMAGE}`);
                ok();
            });
        });

    })
};

// Creates the container and starts it
const run_geth = async () => {
    signale.info(`docker: Creating container ${GANACHE_IMAGE} (${CONTAINER_NAME})`);
    const container = await Docker.createContainer({
            Image: GETH_IMAGE,
            ExposedPorts: {
                '8545': {}
            },
            Cmd: [
                '--rpc', '--rpcport=8545', '--rpcaddr=0.0.0.0', '--rpccorsdomain=*', '--nodiscover', '--maxpeers=0', '--rpcapi=eth,net,web3'
            ],
            Env: [
                "ACCOUNT_NUMBER=10",
                "NET_ID=2702",
                "DATADIR=/tmp/data",
                "MNEMONIC=cross uniform panic climb universe awful surprise list dutch ability label cat"
            ],
            Tty: true,
            HostConfig: {
                AutoRemove: true,
                PortBindings: {
                    '8545': [
                        {
                            HostPort: HOST_PORT
                        }
                    ]
                }
            },
            name: CONTAINER_NAME
        }
    );
    await container.start();
    while (true) {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:8545`));
            const coinbase = await web3.eth.getCoinbase();
            break ;
        } catch (e) {
            console.log('No response from geth, retrying in 5s', e.message);
            await new Promise((ok, ko) => setTimeout(ok, 5000));
        }
    }
    console.log('Waiting 30 sec to let geth unlock all accounts');
    await new Promise((ok, ko) => setTimeout(ok, 30000));
    console.log('Geth accounts should be unlocked');
    console.log('Sending tx to wait for DAG completion');
    const web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:8545`));
    const coinbase = await web3.eth.getCoinbase();
    const receipt = await web3.eth.sendTransaction({
        from: coinbase,
        to: '0x0000000000000000000000000000000000000000',
        value: 1
    });
    console.log('Tx was mined, DAG was built');
};
// Creates the container and starts it
const run_ganache = async () => {
    signale.info(`docker: Creating container ${GANACHE_IMAGE} (${CONTAINER_NAME})`);
    const container = await Docker.createContainer({
            Image: GANACHE_IMAGE,
            ExposedPorts: {
                '8545': {}
            },
            Cmd: [
                'ganache-cli',
                '-i', '2702',
                '-h', '0.0.0.0',
                '-p', '8545',
                '--mnemonic', 'cross uniform panic climb universe awful surprise list dutch ability label cat',
                '--gasLimit', '0xffffffffff',
                '--gasPrice', '0x2540BE400' // 16/05
            ],
            HostConfig: {
                AutoRemove: true,
                PortBindings: {
                    '8545': [
                        {
                            HostPort: HOST_PORT
                        }
                    ]
                },
            },
            name: CONTAINER_NAME
        }
    );
    await container.start();
};

// Writes config with custom description
const write_config = async () => {
    signale.info(`portalize: writing configuration to portal`);
    const network_configuration = {
        type: process.env.T721_NETWORK,
        host: '127.0.0.1',
        connection_protocol: 'http',
        port: HOST_PORT,
        network_id: 2702,
        deployer: '0x945AD1107984F1c8C004D4B076a169cb6E5f12e6',
        server: 'http://127.0.0.1:1337',
        contract_infos: {
            AdministrationBoard: {
                initial_member: '0xF8cf4531433b2Ac4bDB2B84a9E350289eb7F467C'
            }
        }
    };
    Portalize.get.setPortal(from_current('./portal'));
    Portalize.get.setModuleName('network');
    Portalize.get.add('network.json', network_configuration, {
        desc: 'network ready'
    });
};

// Docker kill container
const stop_ganache = async () => {
    try {
        const container = await Docker.getContainer(CONTAINER_NAME);
        await container.kill();
        log(`docker: killing container`);
    } catch (e) {}
    signale.info(`docker: clean !`);
};

// Clean this module's portal
const clean_portal = async () => {
    signale.info(`portalize: clean network !`);
    Portalize.get.setPortal(from_current('./portal'));
    Portalize.get.setModuleName('network');
    Portalize.get.clean();
};

const local_start = async () => {
    if (process.env.T721_GETH_MODE) {
        await pull_geth();
        await run_geth();
    } else {
        await pull_ganache();
        await run_ganache();
    }
    await write_config();
};

const local_clean = async () => {
    await stop_ganache();
    await clean_portal();
};

exports.local_start = local_start;
exports.local_clean = local_clean;
