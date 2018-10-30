'use strict'
const uuid = require('uuid/v1')
const sqs = require('aws-sdk/clients/sqs')
const s3 = require('aws-sdk/clients/s3')


export default class SessionManager {
  constructor(systemName) {
    this.systemName = systemName
    this.sqsClient = new sqs()
    this.s3Client = new s3()
  }

  async createSession() {
    let sessionId = uuid()
    let queueUrl = await this.createSessionQueue(sessionId).QueueUrl
    let session = { sessionId, queueUrl }
    return this.createSessionFile(session)
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

  async createSessionQueue(sessionId) {
    let sessionQueueInfo = {
      QueueName: `${this.systemName}-${sessionId}`,
      Attributes: {
        ReceiveMessageWaitTimeSeconds: '20'
      }
    }
    return this.sqsClient.createQueue(sessionQueueInfo).promise()
  }

  async fetchSessionMeta(sessionId) {
    let sessionFileParams = {
      Bucket: this.systemName,
      Key: `sessions/${sessionId}`
    }
    return this.s3Client.headObject(sessionFileParams).promise()
  }
}
