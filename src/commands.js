'use strict'
const serverless = require('serverless-http')
const express = require('express')
const commands = express()

commands.post('*', function(req, res) {
  // submit the incoming command to the incoming commands topic
})

module.exports.handler = serverless(commands)
