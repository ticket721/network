const dockerode = require('dockerode');
const signale = require('signale');
const {Portalize} = require('portalize');
const {from_current} = require('../misc');

const Docker = new dockerode();

const GANACHE_IMAGE = 'trufflesuite/ganache-cli:v6.3.0';
const HOST_PORT = '8545';
const CONTAINER_NAME = 't721-ganache';

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
                '--gasPrice', '0x01'
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
    await pull_ganache();
    await run_ganache();
    await write_config();
};

const local_clean = async () => {
    await stop_ganache();
    await clean_portal();
};

exports.local_start = local_start;
exports.local_clean = local_clean;
