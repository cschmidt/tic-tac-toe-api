'use strict'
const { CommandProcessor } = require('./command-processor')
const { start_game } = require('./tic-tac-toe-commands')


module.exports.handler = async function(event, context) {
  let commandProcessor = new CommandProcessor()
  commandProcessor.addCommandHandler('start_game', start_game)
  let commands = []
  for (let record of event.Records) {
    let parsedRecord = JSON.parse(record.body)
    let parsedMessage = JSON.parse(parsedRecord.Message)
    for (let command of parsedMessage.commands) {
      commands.push(command)
    }
  }
  console.log('commands', commands)
  return commandProcessor.handle(commands)
}
