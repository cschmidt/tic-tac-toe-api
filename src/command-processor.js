'use strict'
const sns = require('aws-sdk/clients/sns')

function submitEvent(event) {
  let snsClient = new sns()
  let messageParams = {
    Message: JSON.stringify(event),
    TopicArn: process.env.EVENTS_TOPIC_ARN
  }
  return snsClient.publish(messageParams).promise()
}


module.exports.handler = async function(event, context) {
  console.log('event', event, 'context', context)
  for (let record of event.Records) {
    let message = JSON.parse(record.body).Message
    console.log('message', message)
  }
  return submitEvent({})
}
