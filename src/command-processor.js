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

  async handle(commands) {
    let events = []
    for (let command of commands) {
      let handler = this.handlerFor(command)

      handler(command, events)
      console.log('handler', handler, '\ncommand', command, '\nevents', events)
    }
    for (let event of events) {
      await this.submitEvent(event)
    }
  }

  handlerFor(command) {
    let commandName = Object.keys(command)[0]
    return this.commandHandlers[commandName]
  }

  async submitEvent(event) {
    let messageParams = {
      Message: JSON.stringify(event),
      // TopicArn: process.env.EVENTS_TOPIC_ARN
      TopicArn: 'arn:aws:sns:us-west-2:745313119890:tic-tac-toe-api-dev-events'
    }
    let response = await this.snsClient.publish(messageParams).promise()
    console.log('submitting event', messageParams, '\nresponse', response)
  }
}

module.exports = { CommandProcessor }
