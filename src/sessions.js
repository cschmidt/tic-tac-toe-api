'use strict'
const serverless = require('serverless-http')
const express = require('express')
const uuid = require('uuid/v1')
const sqs = require('aws-sdk/clients/sqs')
const s3 = require('aws-sdk/clients/s3')
const sessions = express()


function createSessionFile(session) {
  if (!process.env.RESOURCE_PREFIX) {
    throw new Error('Service not configured')
  }
  let sessionFile = {
    ACL: 'authenticated-read',
    Bucket: process.env.RESOURCE_PREFIX,
    Key: `sessions/${session.sessionId}`,
    Body: JSON.stringify(session)
  }
  let s3Client = new s3()
  return s3Client.putObject(sessionFile).promise()
}


function createSessionQueue(session) {
  let sqsClient = new sqs()
  // FIXME: don't hard-code queue prefix
  let sessionQueueInfo = {
    QueueName: `tic-tac-toe-api-dev-${session.sessionId}`,
    Attributes: {
      ReceiveMessageWaitTimeSeconds: '20'
    }
  }
  return sqsClient.createQueue(sessionQueueInfo).promise()
}


sessions.post('*', (req, res) => {
  let sessionId = uuid()
  let session = {
    sessionId,
    queueUrl: ''
  }
  createSessionFile(session).then(() => {
    return createSessionQueue(session)
  }).then(data => {
    session.queueUrl = data.QueueUrl
    res.json(session)
  }).catch(err => {
    res.status(500).send('Error')
    console.log('req', req, 'err', err)
  })
})

module.exports.handler = serverless(sessions)
