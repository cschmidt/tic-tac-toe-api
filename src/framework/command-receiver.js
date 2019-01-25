'use strict'
const sns = require('aws-sdk/clients/sns')
const { SessionManager } = require('./session-manager')

if (!process.env.RESOURCE_PREFIX) {
  throw new Error('Service not configured')
}

let sessionManager = new SessionManager(process.env.RESOURCE_PREFIX)


async function validateCommand(command) {
  // make sure there's a session id
  if (!command.session_id) {
    throw new Error(`Missing session_id in "${command}"`)
  }
  else {
    await sessionManager.fetchSessionMeta(command.session_id)
  }
  // ultimately, ensure it conforms to a valid command
  return command
}


async function submitCommand(command) {
  let snsClient = new sns()
  let messageParams = {
    Message: JSON.stringify(command),
    TopicArn: process.env.INCOMING_COMMANDS_TOPIC_ARN
  }
  return snsClient.publish(messageParams).promise()
}


async function handler(event, context) {
  const rawCommand = JSON.parse(event.body)
  rawCommand.session_id = event.requestContext.connectionId
  console.log('command', rawCommand)
  const command = await validateCommand(rawCommand)
  // FIXME: error handling
  await submitCommand(command)
  return { statusCode: 200, body: 'OK' }
}

module.exports = {
  handler
}
