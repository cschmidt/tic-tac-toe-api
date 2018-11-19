'use strict'
const { CommandProcessor } = require('./command-processor')
const { start_game } = require('./tic-tac-toe-commands')

let commandProcessor = new CommandProcessor()
commandProcessor.addCommandHandler('start_game', start_game)


module.exports.handler = async function(event, context) {
  console.log('event', event, 'context', context)
  let commands = []
  for (let record of event.Records) {
    commands.push(JSON.parse(record.body).Message)
    commandProcessor.handle(commands)
  }
}
