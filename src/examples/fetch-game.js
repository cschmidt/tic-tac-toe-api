'use strict'

const { TicTacToeStore } = require('../tic-tac-toe-store')
const tts = new TicTacToeStore('tic-tac-toe-api-dev')
const gameId = '3NHsUhW48SlBB95FmQ-3R'
const gameIds = [
  '3NHsUhW48SlBB95FmQ-3R',
  'YubhdzSdLnu8gmJBCBYTl'
]

const logGame = async function(gameId) {
  console.log(await tts.read(gameId))
}

for (let id of gameIds) {
  logGame(id)
}

// logGame('missing')
