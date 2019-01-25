'use strict'
const uuid = require('uuid/v1')
const s3 = require('aws-sdk/clients/s3')


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

module.exports = { SessionManager }
