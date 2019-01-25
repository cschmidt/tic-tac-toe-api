const { CommandProcessor } = require('./framework/command-processor')
const { TicTacToeStore } = require('./tic-tac-toe-store')
const bucket = process.env.RESOURCE_PREFIX
const tts = new TicTacToeStore(bucket)


const startGame = async(params, events) => {
  let ticTacToe = await tts.create()
  events.push({ game_started: Object.assign({}, ticTacToe) })
}


const makeMove = async(params, events) => {
  // TODO: validate required params: game_id, square, move_number, mark
  let ticTacToe = await tts.read(params.game_id)
  ticTacToe.mark(params.square)
  tts.update(ticTacToe)
  // TODO: validate move number makes sense
  events.push({
    move_made: {
      game_id: ticTacToe.id,
      square: params.square,
      move_number: '?',
      mark: params.mark
    }
  })
  // TODO: send a game_over event if the game is done
}


let commandProcessor = new CommandProcessor()
commandProcessor.addCommandHandler('start_game', startGame)
commandProcessor.addCommandHandler('make_move', makeMove)

module.exports = { commandProcessor }
