const dockerode = require('dockerode');
const {Signale} = require('signale');
const {Portalize} = require('portalize');

const log = new Signale({interactive: true});
const Docker = new dockerode();

const GANACHE_IMAGE = 'trufflesuite/ganache-cli:v6.1.6';
const HOST_PORT = '8545';
const CONTAINER_NAME = 't721-ganache';

// Docker pull the ganache image
const pull_ganache = async () => {
    log.info(`docker: Pulling ${GANACHE_IMAGE}`);
    await Docker.pull(GANACHE_IMAGE);
};

// Creates the container and starts it
const run_ganache = async () => {
    log.info(`docker: Creating container ${GANACHE_IMAGE} (${CONTAINER_NAME})`);
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
                '--mnemonic', 'cross uniform panic climb universe awful surprise list dutch ability label cat'
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
    log.info(`portalize: writing configuration to portal`);
    const network_configuration = {
        type: process.env.T721_NETWORK,
        host: '127.0.0.1',
        port: HOST_PORT,
        network_id: 2702
    };
    Portalize.get.setPortal('./portal');
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
    log.info(`docker: clean !`);
};

// Clean this module's portal
const clean_portal = async () => {
    log.info(`portalize: clean network !`);
    Portalize.get.setPortal('./portal');
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
