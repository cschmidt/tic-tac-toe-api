'use strict'
const { commandProcessor } = require('./tic-tac-toe-commands')


module.exports.handler = async function(event, context) {
  let commands = []
  for (let record of event.Records) {
    let parsedRecord = JSON.parse(record.body)
    let parsedMessage = JSON.parse(parsedRecord.Message)
    commands.session_id = parsedMessage.session_id
    for (let command of parsedMessage.commands) {
      commands.push(command)
    }
  }
  try {
    return await commandProcessor.handle(commands)
  }
  catch (err) {
    console.log('err', err)
  }
}
