'use strict'
const serverless = require('serverless-http')
const express = require('express')
const commands = express()

commands.post('*', function(req, res) {
  res.send('commands!')
})

module.exports.handler = serverless(commands)
