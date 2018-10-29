'use strict'

module.exports.handler = async function(event, context) {
  console.log(event)
  let response = {
    statusCode: 200,
    headers: {
      'x-custom-header': 'My Header Value'
    }
  }
  if (!process.env.RESOURCE_PREFIX) {
    response.statusCode = 500
    response.body = 'Service not configured'
    console.log('Must set RESOURCE_PREFIX environment variable to the S3 bucket name')
  }
  else {
    response.body = JSON.stringify({ bucket: process.env.RESOURCE_PREFIX })
  }
  return response
}
