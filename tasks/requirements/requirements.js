const fs = require('fs');
const {from_current} = require('../misc');

const requirements = async () => {
    // Check if portal is deployed
    if (!fs.existsSync(from_current('./portal'))) {
        throw new Error('Cannot find portal, directory has not been initialized');
    }

    // Check if Network is specified
    if (!process.env.T721_NETWORK) {
        throw new Error('Env argument T721_NETWORK is required');
    }

    if (process.env.T721_NETWORK === 'ropsten') {
        const required = ['T721_NETWORK_ID',
        'INFURA_PROJECT_KEY',
        'INFURA_SECRET_KEY',
        'INFURA_URL',
        'T721_SERVER_URL',
        'T721_DEPLOYER',
        'T721_ADMIN'];

        for (const requirement of required) {
            if (!process.env[requirement]) {
                throw new Error(`Missing Env Variable: ${requirement}`);
            }
        }

    }
};

module.exports = requirements;
