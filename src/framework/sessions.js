'use strict'
const serverless = require('serverless-http')
const express = require('express')
const sessions = express()
const { SessionManager } = require('./session-manager')

if (!process.env.RESOURCE_PREFIX) {
  throw new Error('Service not configured')
}

let sessionManager = new SessionManager(process.env.RESOURCE_PREFIX)


sessions.post('*', async(req, res) => {
  try {
    let session = await sessionManager.createSession()
    res.json(session)
  }
  catch (err) {
    res.status(500).send('Error')
    console.log('req', req, 'err', err)
  }
})

module.exports.handler = serverless(sessions)
