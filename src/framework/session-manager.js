'use strict'
const { v1:uuid } = require('uuid')
const s3 = require('aws-sdk/clients/s3')

const success = {
  statusCode: 200
}

class SessionManager {
  constructor(systemName) {
    this.systemName = systemName
    this.s3Client = new s3()
  }

  async createSession(sessionId = uuid()) {
    console.log('createSession', sessionId)
    let session = { sessionId }
    await this.createSessionFile(session)
    return session
  }

  async deleteSession(sessionId) {
    console.log('deleteSession', sessionId)
    await this.deleteSessionFile(sessionId)
  }

  async createSessionFile(session) {
    let sessionFileParams = {
      ACL: 'authenticated-read',
      Bucket: this.systemName,
      Key: `sessions/${session.sessionId}`,
      Body: JSON.stringify(session)
    }
    return this.s3Client.putObject(sessionFileParams).promise()
  }

  async deleteSessionFile(sessionId) {
    let sessionFileParams = {
      Bucket: this.systemName,
      Key: `sessions/${sessionId}`
    }
    return this.s3Client.deleteObject(sessionFileParams).promise()
  }

  async fetchSessionMeta(sessionId) {
    let sessionFileParams = {
      Bucket: this.systemName,
      Key: `sessions/${sessionId}`
    }
    return this.s3Client.headObject(sessionFileParams).promise()
  }
}

if (!process.env.RESOURCE_PREFIX) {
  throw new Error('Service not configured')
}

const sessionManager = new SessionManager(process.env.RESOURCE_PREFIX)

async function handler(event, context) {
  try {
    if (event.requestContext.eventType === 'CONNECT') {
      console.log('event.requestContext.connectionId', event.requestContext.connectionId)
      await sessionManager.createSession(event.requestContext.connectionId)
    }
    else if (event.requestContext.eventType === 'DISCONNECT') {
      await sessionManager.deleteSession(event.requestContext.connectionId)
    }
    return success
  }
  catch (error) {
    // FIXME: error handling
    console.log({ error })
  }
}


module.exports = {
  handler,
  SessionManager
}
