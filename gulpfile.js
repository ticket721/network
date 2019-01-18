const {series} = require('gulp');
const {Portalize} = require('portalize');
const signale = require('signale');
const fs = require('fs');

const {local_start, local_clean} = require('./tasks/local');

const requirements = async () => {
    // Check if portal is deployed
    if (!fs.existsSync('./portal')) {
        throw new Error('Cannot find portal, directory has not been initialized');
    }

    // Check if Network is specified
    if (!process.env.T721_NETWORK) {
        throw new Error('Env argument T721_NETWORK is required');
    }
};

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

const clean = async () => {
    signale.info('[network][clean]');

    // clean specified network
    switch (process.env.T721_NETWORK) {
        case 'local':
            await local_clean();
            break;
        default:
            throw new Error(`Unknown Network ${process.env.T721_NETWORK}`)
    }
    return signale.info('[network][cleaned]');
};

exports['network:start'] = series(requirements, start);
exports['network:clean'] = series(requirements, clean);
