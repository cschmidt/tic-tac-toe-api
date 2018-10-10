'use strict'
const serverless = require('serverless-http')
const express = require('express')
const uuid = require('uuid/v1')
const sessions = express()

sessions.post('*', function(req, res) {
  let session = {
    session_id: uuid(),
    queue_url: '[queue_url]'
  }
  res.json(session)
  console.log('req', req)
})

module.exports.handler = serverless(sessions)
