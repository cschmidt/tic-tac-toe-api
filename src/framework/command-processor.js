'use strict'
const sns = require('aws-sdk/clients/sns')

class CommandProcessor {
  constructor() {
    this.snsClient = new sns
    this.commandHandlers = {}
  }

  addCommandHandler(commandType, handler) {
    if (typeof handler !== 'function') {
      throw new Error(`handler for ${commandType} is not a function`)
    }
    if (handler.length != 2) {
      throw new Error(`handler for ${commandType} should have exactly two args`)
    }
    this.commandHandlers[commandType] = handler
  }

  errorEvent(error) {
    return {
      error: {
        ...error,
        message: error.message,
        name: error.name
      }
    }
  }

  async handle(commands) {
    let events = []
    for (let command of commands) {
      let handler = this.handlerFor(command)
      let commandName = Object.keys(command)[0]
      // strip out the command name from the params we hand to the command
      // itself
      let params = command[commandName]
      try {
        await handler(params, events)
      }
      catch (error) {
        events.push(this.errorEvent(error))
      }
      console.log('command', command, '\nevents', events)
    }
    const eventMessage = {
      session_id: commands.session_id,
      events
    }
    await this.submitEvent(eventMessage)
  }

  handlerFor(command) {
    let commandName = Object.keys(command)[0]
    return this.commandHandlers[commandName]
  }

  async submitEvent(event) {
    let messageParams = {
      Message: JSON.stringify(event),
      TopicArn: process.env.EVENTS_TOPIC_ARN
    }
    return this.snsClient.publish(messageParams).promise()
  }
}

module.exports = { CommandProcessor }
