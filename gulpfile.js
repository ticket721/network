const {series} =        require('gulp');

const {requirements} =  require('./tasks/requirements');
const start =           require('./tasks/start');
const clean =           require('./tasks/clean');

exports['network:start'] = series(requirements, start);
exports['network:clean'] = series(requirements, clean);
