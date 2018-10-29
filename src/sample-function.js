'use strict'
const serverless = require('serverless-http')
const express = require('express')
const sample = express()


sample.get('*', (req, res) => {
  if (!process.env.RESOURCE_PREFIX) {
    res.status(500, 'Service not configured')
    console.log('Must set RESOURCE_PREFIX environment variable to the S3 bucket name')
  }
  else {
    res.json({ bucket: process.env.RESOURCE_PREFIX })
  }
})

module.exports.handler = serverless(sample)
