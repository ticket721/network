const bip39 = require('bip39');
const hdkey = require('hdkey');
const utils = require('ethereumjs-util');
const readline = require('readline');
const Web3 = require('web3');
const Web3HDWalletProvider = require("web3-hdwallet-provider");

const main = async () => {

    if (!process.env.INFURA_PROJECT_KEY || !process.env.FARMER_TARGET_ADDRESS || !process.env.INFURA_URL) {
        console.error(`Requires INFURA_PROJECT_KEY, FARMER_TARGET_ADDRESS and INFURA_URL env values`);
        process.exit(1);
    }

    while (true) {
        const mnemonic = bip39.generateMnemonic();

        const seed = bip39.mnemonicToSeedSync(mnemonic);

        const root = hdkey.fromMasterSeed(seed);
        const derived = root.derive("m/44'/60'/0'/0/0");

        const address = `0x${utils.privateToAddress(derived.privateKey).toString('hex')}`;

        console.log('Address:', address);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        await new Promise(resolve => rl.question('Enter when ready to transfer: ', ans => {
            rl.close();
            resolve(ans);
        }))

        try {
            const web3 = new Web3(new Web3HDWalletProvider(mnemonic, `${process.env.INFURA_URL}/${process.env.INFURA_PROJECT_KEY}`), 0);

            const tx = await web3.eth.sendTransaction({
                from: address,
                to: process.env.FARMER_TARGET_ADDRESS,
                value: web3.utils.toWei('0.99')
            })

            console.log(tx);
        } catch (e) {
            console.error(e);
        }

    }
};

module.exports = main;
