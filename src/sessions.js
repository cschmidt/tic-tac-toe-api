'use strict'
const serverless = require('serverless-http')
const express = require('express')
const uuid = require('uuid/v1')
const sqs = require('aws-sdk/clients/sqs')
const s3 = require('aws-sdk/clients/s3')
const sessions = express()

sessions.get('*', function(req, res) {
  let session_id = uuid()
  let session = {
    session_id,
    queue_url: '[queue_url]'
  }
  let params = {
    ACL: 'authenticated-read',
    Bucket: 'tic-tac-toe-api-dev',
    Key: `sessions/${session_id}`,
    Body: JSON.stringify(session)
  }
  let s3Client = new s3()
  s3Client.putObject(params).promise().then(data => {
    res.json(session)
    // console.log('req', req)
  }).catch(err => {
    res.json({ 'error': err })
    console.log('err', err)
  })
})

module.exports.handler = serverless(sessions)
