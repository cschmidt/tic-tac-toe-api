'use strict'
/* global jest beforeEach it expect */
const { TicTacToeStore } = require('./tic-tac-toe-store')
let ticTacToeStore = {}


beforeEach(() => {
  ticTacToeStore = new TicTacToeStore()
})

it('initializes', () => {
  expect(ticTacToeStore).toBeInstanceOf(TicTacToeStore)
})

it('generates a game id', () => {
  let gameId = ticTacToeStore.newGameId()
  expect(gameId).toBeTruthy()
})
