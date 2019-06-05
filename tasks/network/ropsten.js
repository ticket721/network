const signale = require('signale');
const {Portalize} = require('portalize');
const {from_current} = require('../misc');

// Writes config with custom description
const write_config = async () => {
    signale.info(`portalize: writing configuration to portal`);
    const network_configuration = {
        type: process.env.T721_NETWORK,
        url: `${process.env.INFURA_URL}/${process.env.INFURA_PROJECT_KEY}`,
        network_id: process.env.T721_NETWORK_ID,
        deployer: process.env.T721_DEPLOYER,
        server: process.env.T721_SERVER_URL,
        network_gas: 7000000,
        contract_infos: {
            AdministrationBoard: {
                initial_member: process.env.T721_ADMIN
            }
        }
    };
    Portalize.get.setPortal(from_current('./portal'));
    Portalize.get.setModuleName('network');
    Portalize.get.add('network.json', network_configuration, {
        desc: 'network ready'
    });
};

// Clean this module's portal
const clean_portal = async () => {
    signale.info(`portalize: clean network !`);
    Portalize.get.setPortal(from_current('./portal'));
    Portalize.get.setModuleName('network');
    Portalize.get.clean();
};

const ropsten_start = async () => {
    await write_config();
};

const ropsten_clean = async () => {
    await clean_portal();
};

exports.ropsten_start = ropsten_start;
exports.ropsten_clean = ropsten_clean;
