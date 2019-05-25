const Web3 = require('web3');
const {Portalize} = require('portalize');
const {from_current} = require('./misc');
const {Signale} = require('signale');
const {argv} = require('yargs');

const mine_one = async (web3) =>
    new Promise(
        (ok, ko) => {
            web3.currentProvider.send(
                {
                    method: 'evm_mine',
                    params: [],
                    jsonrpc: '2.0',
                    id: 0
                },
                ((err, val) => {
                    if (err) {
                        return ko(err);
                    } else {
                        ok();
                    }
                })
            );
        }
    );

module.exports.mine = async function mine() {

    let {blocks} = argv;

    if (blocks === undefined) {
        throw new Error('Usage: gulp mine --blocks <count>');
    }

    blocks = parseInt(blocks);

    Portalize.get.setPortal(from_current('./portal'));
    Portalize.get.setModuleName('network');

    const config = Portalize.get.get('network.json');

    if (config.type !== 'local') {
        throw new Error('Cannot mine on non-local network');
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(`http://${config.host}:${config.port}`));

    const signale = new Signale();
    signale.info(`Starting mining process for ${blocks} blocks`);
    let last_percent = 0;

    const logger = new Signale({
        interactive: true
    });

    logger.info(`[${last_percent}%]`);
    for (let idx = 0; idx < blocks; ++idx) {
        await mine_one(web3);

        if (Math.floor((idx / blocks) * 100) > last_percent) {
            last_percent = Math.floor((idx / blocks) * 100);
            logger.info(`[${last_percent}%]`);
        }
    }
    logger.success(`[100%]`);
    signale.success(`Finished mining process for ${blocks} blocks`);

};
