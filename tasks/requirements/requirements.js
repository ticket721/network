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
};

module.exports = requirements;
