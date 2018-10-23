'use strict'
const serverless = require('serverless-http')
const express = require('express')
const sample = express()


sample.get('*', (req, res) => {
  if (!process.env.BUCKET) {
    res.status(500, 'Service not configured')
    console.log('Must set BUCKET environment variable to the S3 bucket name')
  }
  else {
    res.json({ hi: 'there', bucket: process.env.BUCKET })
  }
})

module.exports.handler = serverless(sample)
