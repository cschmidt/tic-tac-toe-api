'use strict'
const s3 = require('aws-sdk/clients/s3')
const nanoid_en = require('nanoid-good/locale/en')
const nanoid = require('nanoid-good')(nanoid_en)
const { TicTacToe } = require('./tic-tac-toe')
const { CommandProcessor } = require('./command-processor')


let commandProcessor = new CommandProcessor()
commandProcessor.addCommandHandler('start_game', async(command, events) => {
  // create a game id and empty game
  let ticTacToe = new TicTacToe()
  let gameId = nanoid()
  ticTacToe.id = gameId
  // create a new game record in S3
  let s3Client = new s3()
  let gameFileParams = {
    ACL: 'authenticated-read',
    Bucket: process.env.RESOURCE_PREFIX,
    Key: `games/${gameId}`,
    Body: JSON.stringify(ticTacToe)
  }
  // FIXME: maybe do a uniqueness check? We're using an id generation mechanism
  // that we expect will avoid collisions, however, it's not impossible. Also,
  // here's an interesting area to add some smarts. We want user-exposed ids to
  // be concise, so could we start with a small-ish number of bits, and then
  // expand that as necessary?
  return s3Client.putObject(gameFileParams)
})


module.exports.handler = async function(event, context) {
  console.log('event', event, 'context', context)
  let commands = []
  for (let record of event.Records) {
    commands.push(JSON.parse(record.body).Message)
    commandProcessor.handle(commands)
  }
}
