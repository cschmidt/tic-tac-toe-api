'use strict'
const serverless = require('serverless-http')
const express = require('express')
const sessions = express()

sessions.post('*', function(req, res) {
  res.send('sessions!')
})

module.exports.handler = serverless(sessions)
