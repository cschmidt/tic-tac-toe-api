'use strict'
const ApiGatewayManagementApi = require('aws-sdk/clients/apigatewaymanagementapi')
const ApiGatewayV2 = require('aws-sdk/clients/apigatewayv2')

let apiGatewayManagementClient = null

async function getApiEndpoint(apiName) {
  const apiGatewayV2 = new ApiGatewayV2()
  const apis = await apiGatewayV2.getApis().promise()
  const websocketsApi = apis.Items.find((api) => api.Name === apiName)
  // This isn't very clean. Serverless Framework uses the stage as the first
  // part of the API name, so we can snag the stage from there. Ideally the AWS
  // API would provide this (it's included in the UI), but it's not present in
  // the API response.
  const stage = apiName.split('-')[0]
  if (websocketsApi) {
    return websocketsApi.ApiEndpoint.replace('wss://', 'https://') + '/' + stage
  }
  else {
    throw new Error(`Couldn't find API named ${apiName}`)
  }
}


async function handler(event, context) {
  if (apiGatewayManagementClient === null) {
    const endpoint = await getApiEndpoint(process.env.WEBSOCKETS_API_NAME)
    console.log('Initializing client for', endpoint)
    apiGatewayManagementClient = new ApiGatewayManagementApi({ endpoint })
  }
  for (let record of event.Records) {
    const parsedRecord = JSON.parse(record.body)
    const parsedMessage = JSON.parse(parsedRecord.Message)
    const params = {
      ConnectionId: parsedMessage.session_id,
      Data: JSON.stringify(parsedMessage)
    }
    console.log('params', params)
    try {
      await apiGatewayManagementClient.postToConnection(params).promise()
    }
    catch (e) {
      console.log('error', e)
    }
  }
}


module.exports = { handler }
