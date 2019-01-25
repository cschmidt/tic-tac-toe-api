'use strict'
const ApiGatewayManagementApi = require('aws-sdk/clients/apigatewaymanagementapi')
const ApiGatewayV2 = require('aws-sdk/clients/apigatewayv2')

let apiGatewayManagementClient = null

async function getApiEndpoint(apiName) {
  const apiGatewayV2 = new ApiGatewayV2()
  const apis = await apiGatewayV2.getApis().promise()
  const websocketApi = apis.Items.find((api) => api.Name === apiName)
  const apiId = websocketApi ? websocketApi.ApiId : null
  // FIXME: don't hardcode region and stage
  const region = process.env.AWS_REGION
  const stage = 'dev'
  return `${apiId}.execute-api.${region}.amazonaws.com/${stage}`
}


async function handler(event, context) {
  if (apiGatewayManagementClient === null) {
    console.log('initializing apiGatewayManagementClient')
    const endpoint = await getApiEndpoint(process.env.API_NAME)
    console.log('endpoint', endpoint)
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
    await apiGatewayManagementClient.postToConnection(params).promise()
  }
}


module.exports = { handler }
