const { CommandProcessor } = require('./framework/command-processor')
const { TicTacToeStore } = require('./tic-tac-toe-store')
const { outcomes } = require('./tic-tac-toe')
const bucket = process.env.RESOURCE_PREFIX
const tts = new TicTacToeStore(bucket)


const gameOverEvent = (game) => {
  return {
    game_over: {
      game_id: game.id,
      outcome: game.outcome,
      winningLine: game.winningLine,
      winner: game.turn
    }
  }
}

const gameStartedEvent = (game) => {
  return {
    game_started: Object.assign({}, game)
  }
}

const moveMadeEvent = (game, params) => {
  return {
    move_made: {
      game_id: game.id,
      square: params.square,
      move_number: '?',
      mark: params.mark
    }
  }
}

const startGame = async(params, events) => {
  let game = await tts.create()
  events.push(gameStartedEvent(game))
}


const makeMove = async(params, events) => {
  // TODO: validate required params: game_id, square, move_number, mark
  let game = await tts.read(params.game_id)
  game.mark(params.square, params.mark)
  await tts.update(game)
  // TODO: validate move number makes sense (could this be better implemented as
  // a horizontal concern? update versioning?)
  events.push(moveMadeEvent(game, params))
  if (game.outcome !== outcomes.UNKNOWN) {
    events.push(gameOverEvent(game))
  }
}


let commandProcessor = new CommandProcessor()
commandProcessor.addCommandHandler('start_game', startGame)
commandProcessor.addCommandHandler('make_move', makeMove)

module.exports = { commandProcessor }
