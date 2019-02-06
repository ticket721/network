const signale = require('signale');
const {Portalize} = require('portalize');
const {local_start} = require('./network/local');

const start = async () => {
    signale.info('[network][start]');

    // Check if deployment hasn't already occured
    Portalize.get.setPortal('./portal');
    Portalize.get.setModuleName('network');
    if (Portalize.get.requires({
        action: 'add',
        desc: 'network ready',
        file: 'network.json',
        from: 'network'
    })) {
        return signale.info('[network][started]')
    }

    // start specified network
    switch (process.env.T721_NETWORK) {
        case 'local':
            await local_start();
            break;
        default:
            throw new Error(`Unknown Network ${process.env.T721_NETWORK}`)
    }
    return signale.info('[network][started]');
};

module.exports = start;
