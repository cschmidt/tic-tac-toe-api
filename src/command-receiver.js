'use strict'
const serverless = require('serverless-http')
const express = require('express')
const commandReceiver = express()
const sns = require('aws-sdk/clients/sns')
const s3 = require('aws-sdk/clients/s3')
const bodyParser = require('body-parser')

async function validateCommand(command) {
  // make sure there's a session id
  if (!command.session_id) {
    throw new Error(`Missing session_id in "${command}"`)
  }
  else {
    let session_meta = await fetchSessionMeta(command.session_id)
  }
  // ultimately, ensure it conforms to a valid command
  return command
}

async function fetchSessionMeta(session_id) {
  let s3Client = new s3()
  let sessionFileParams = {
    Bucket: process.env.RESOURCE_PREFIX,
    Key: `sessions/${session_id}`
  }
  return s3Client.headObject(sessionFileParams).promise()
}


async function submitCommand(command) {
  let snsClient = new sns()
  let messageParams = {
    Message: JSON.stringify(command),
    TopicArn: process.env.INCOMING_COMMANDS_TOPIC_ARN
  }
  return snsClient.publish(messageParams).promise()
}

commandReceiver.use(bodyParser.json())

commandReceiver.post('*', async function(req, res) {
  try {
    let command = await validateCommand(req.body)
    let snsResponse = await submitCommand(command)
    res.json(snsResponse)
  }
  catch (err) {
    res.status(500).send('Error')
    console.log('req', req, 'err', err)
  }
})

module.exports.handler = serverless(commandReceiver)
