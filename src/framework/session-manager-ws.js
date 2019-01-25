'use strict'
const { SessionManager } = require('./session-manager')

const success = {
  statusCode: 200
}

if (!process.env.RESOURCE_PREFIX) {
  throw new Error('Service not configured')
}

const sessionManager = new SessionManager(process.env.RESOURCE_PREFIX)

async function handler(event, context) {
  // FIXME: add a DEBUG logging level?
  // console.log('event\n', event, '\ncontext\n', context)
  try {
    if (event.requestContext.eventType === 'CONNECT') {
      await sessionManager.createSession(event.requestContext.channelId)
    }
    else if (event.requestContext.eventType === 'DISCONNECT') {
      await sessionManager.deleteSession(event.requestContext.channelId)
    }
    // res.json(session)
    return success
  }
  catch (err) {
    // FIXME: error handling
    console.log('err', err)
  }
}

module.exports = {
  handler
}
