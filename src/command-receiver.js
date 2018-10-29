'use strict'
const serverless = require('serverless-http')
const express = require('express')
const commandReceiver = express()
const sns = require('aws-sdk/clients/sns')
const bodyParser = require('body-parser')

function submitCommand(command) {
  let snsClient = new sns()
  let messageParams = {
    Message: JSON.stringify(command),
    TopicArn: process.env.INCOMING_COMMANDS_TOPIC_ARN
  }
  return snsClient.publish(messageParams).promise()
}

commandReceiver.use(bodyParser.json())

commandReceiver.post('*', function(req, res) {
  // FIXME: validate the command syntax, check session validity
  submitCommand(req.body).then(snsResponse => {
    res.json(snsResponse)
  }).catch(err => {
    res.status(500).send('Error')
    console.log('req', req, 'err', err)
  })
})

module.exports.handler = serverless(commandReceiver)
