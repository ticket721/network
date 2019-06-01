const {series} = require('gulp');

const {requirements} = require('./tasks/requirements');
const start = require('./tasks/start');
const clean = require('./tasks/clean');
const {mine} = require('./tasks/mine');
const farmer = require('./tasks/faucet_farmer');

exports['network:start'] = series(requirements, start);
exports['network:clean'] = series(requirements, clean);
exports['network:mine'] = series(mine);
exports['network:farmer'] = series(farmer);
