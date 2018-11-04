'use strict'
const sns = require('aws-sdk/clients/sns')
const { TicTacToe } = require('./tic-tac-toe')

function submitEvent(event) {
  let snsClient = new sns()
  let messageParams = {
    Message: JSON.stringify(event),
    TopicArn: process.env.EVENTS_TOPIC_ARN
  }
  return snsClient.publish(messageParams).promise()
}

const messageHandlers = {}
messageHandlers.start_game = (message, events) => {
  // create a game id and empty game
  let ticTacToe = new TicTacToe()
  // create a new game record in S3

}

messageHandlers.join_game = (message, events) => {}
messageHandlers.make_move = (message, events) => {}



module.exports.handler = async function(event, context) {
  console.log('event', event, 'context', context)
  for (let record of event.Records) {
    let message = JSON.parse(record.body).Message
    console.log('message', message)
  }
  return submitEvent({})
}
