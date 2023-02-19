const chalk = require('chalk');

module.exports = {
    name: 'err',
    execute(err) {
        console.log(chalk.red(`[DB]: Error when connecting:\n${err}`));
    }
};