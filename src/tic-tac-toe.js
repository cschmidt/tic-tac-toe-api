'use strict'
const { v1:uuid } = require('uuid')

const players = {
  X: 'X',
  O: 'O'
}

const outcomes = {
  UNKNOWN: 'UNKNOWN',
  WIN: 'WIN',
  DRAW: 'DRAW'
}

// Representations of all vertical, horizontal and diagonal lines
const lines = [
  ['a1', 'a2', 'a3'],
  ['b1', 'b2', 'b3'],
  ['c1', 'c2', 'c3'],
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  ['a1', 'b2', 'c3'],
  ['a3', 'b2', 'c1']
]


// Errors

class GameOverError extends Error {
  constructor(gameId) {
    super('Game Over!')
    this.name = 'GameOverError'
    this.gameId = gameId
  }
}

class SquareAlreadyMarkedError extends Error {
  constructor(gameId, square) {
    super(`${square} is already marked`)
    this.name = 'SquareAlreadyMarkedError'
    this.gameId = gameId
    this.square = square
  }
}

class MoveOutOfTurnError extends Error {
  constructor(gameId, attemptedSquare, attemptedMark, currentTurn) {
    super(`Tried to mark ${attemptedSquare} with ${attemptedMark}, but it's ${currentTurn}'s turn`)
    this.name = 'MoveOutOfTurnError'
    this.gameId = gameId
    this.attemptedSquare = attemptedSquare
    this.attemptedMark = attemptedMark
    this.currentTurn = currentTurn
  }
}

class TicTacToe {
  constructor() {
    this.squares = {
      a1: { mark: '' },
      a2: { mark: '' },
      a3: { mark: '' },
      b1: { mark: '' },
      b2: { mark: '' },
      b3: { mark: '' },
      c1: { mark: '' },
      c2: { mark: '' },
      c3: { mark: '' }
    }
    this.turn = players.X
    this.outcome = outcomes.UNKNOWN
    this.winningLine = null
    this.synopsis = ''
  }

  mark(square, _mark) {
    let isSquareEmpty = this.squares[square] && this.squares[square].mark === ''

    // mark the game board if the requested square is empty and the game is
    // still in play
    if (!this.inProgress()) {
      throw new GameOverError(this.id)
    }
    else if (!isSquareEmpty) {
      throw new SquareAlreadyMarkedError(this.id, square)
    }
    else if (_mark !== this.turn) {
      throw new MoveOutOfTurnError(this.id, square, _mark, this.turn)
    }
    else {
      this.squares[square].mark = this.turn
      this.determineOutcome()
      // switch players if the game is still in play
      this.turn =
        this.outcome === outcomes.UNKNOWN ?
        (this.turn === players.X ? players.O : players.X) : this.turn
    }
    this.synopsis = this.produceSynopsis()
    return this
  }

  determineOutcome() {
    // See if there's a straight line of one mark (X's or O's), or if the board
    // is fully marked without a winner (a draw).
    let counts = { 'X': 0, 'O': 0, '': 0 }
    lines.forEach((line) => {
      line.forEach((square) => {
        counts[this.squares[square].mark]++
      })
      if (counts.X === 3 || counts.O === 3) {
        this.outcome = outcomes.WIN
        this.winningLine = line
      }
      // Reset X and O counts for next line (don't reset empty space count).
      counts.X = 0
      counts.O = 0
    })
    // If there are no empty squares, and we haven't already found a winner, we
    // must have a draw.
    if (this.outcome === outcomes.UNKNOWN && counts[''] === 0) {
      this.outcome = outcomes.DRAW
    }
  }

  inProgress() {
    return this.outcome === outcomes.UNKNOWN
  }

  produceSynopsis() {
    let synopsis = '?'
    switch (this.outcome) {
      case outcomes.UNKNOWN:
        this.synopsis = 'In Progress'
        break
      case outcomes.WIN:
        this.synopsis = `${this.turn} wins!`
        break
      case outcomes.DRAW:
        this.synopsis = 'Draw'
        break
    }
    return synopsis
  }
}

module.exports = { TicTacToe, GameOverError, SquareAlreadyMarkedError, MoveOutOfTurnError, outcomes, players }
