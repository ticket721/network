const {series} = require('gulp');

const {requirements} = require('./tasks/requirements');
const start = require('./tasks/start');
const clean = require('./tasks/clean');
const {mine} = require('./tasks/mine');

exports['network:start'] = series(requirements, start);
exports['network:clean'] = series(requirements, clean);
exports['network:mine'] = series(mine);
