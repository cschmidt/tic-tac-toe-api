'use strict'
/* global jest beforeEach it expect */
const { TicTacToe, outcomes, SquareAlreadyMarkedError, GameOverError, MoveOutOfTurnError } = require('./tic-tac-toe')
let game = {}


beforeEach(() => {
  game = new TicTacToe()
})


it('has an empty starting board', () => {
  for (let square in game.squares) {
    expect(game.squares[square].mark).toEqual('')
  }
})

it('starts with the outcome being unknown', () => {
  expect(game.outcome).toEqual(outcomes.UNKNOWN)
})

it('can make moves and take turns', () => {
  game.mark('a1', 'X')
  expect(game.squares.a1.mark).toEqual('X')
  game.mark('a2', 'O')
  expect(game.squares.a2.mark).toEqual('O')
})

it('prevents out of turn play', () => {
  game.mark('a1', 'X')
  expect(() => {
    game.mark('a2', 'X')
  }).toThrowError(MoveOutOfTurnError)
})

it('determines the winner', () => {
  game.mark('a1', 'X')
  // we still don't know the outcome after a single move
  expect(game.outcome).toEqual(outcomes.UNKNOWN)
  game
    .mark('b1', 'O')
    .mark('a2', 'X')
    .mark('b2', 'O')
    .mark('a3', 'X')
  // X should have won
  expect(game.outcome).toEqual(outcomes.WIN)
  expect(game.turn).toEqual('X')
})

it('knows when the game is a draw', () => {
  game
    .mark('a1', 'X')
    .mark('b1', 'O')
    .mark('a2', 'X')
    .mark('b2', 'O')
    .mark('c1', 'X')
    .mark('c2', 'O')
    .mark('b3', 'X')
    .mark('a3', 'O')
    .mark('c3', 'X')
  // should now have a draw
  expect(game.outcome).toEqual(outcomes.DRAW)
  // last turn was X
  expect(game.turn).toEqual('X')
})

it('differentiates between draw and win with all squares marked', () => {
  game
    .mark('a1', 'X')
    .mark('b1', 'O')
    .mark('c1', 'X')
    .mark('a2', 'O')
    .mark('b2', 'X')
    .mark('c2', 'O')
    .mark('b3', 'X')
    .mark('a3', 'O')
    .mark('c3', 'X')
  expect(game.outcome).toEqual(outcomes.WIN)
  expect(game.winningLine).toEqual(['a1', 'b2', 'c3'])
})

it('prevents the same square from being marked twice', () => {
  game.mark('a1', 'X')
  expect(() => {
    game.mark('a1', 'X')
  }).toThrowError(SquareAlreadyMarkedError)
})

it('prevents play when the game is over', () => {
  game
    .mark('a1', 'X')
    .mark('a2', 'O')
    .mark('b1', 'X')
    .mark('b2', 'O')
    .mark('c1', 'X')
  expect(game.outcome).toEqual(outcomes.WIN)
  expect(() => {
    game.mark('c2', 'O')
  }).toThrowError(GameOverError)
})
