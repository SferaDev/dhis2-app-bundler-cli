const { namespace } = require('@dhis2/cli-helpers-engine')

module.exports = namespace('bundler', {
    description: '',
    builder: yargs => yargs.commandDir('./commands'),
})
