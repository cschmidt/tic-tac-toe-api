const { CommandProcessor } = require('./command-processor')
const { TicTacToeStore } = require('./tic-tac-toe-store')
const bucket = process.env.RESOURCE_PREFIX
const tts = new TicTacToeStore(bucket)


const startGame = async(params, events) => {
  let ticTacToe = tts.create()
  events.push({ game_started: Object.assign({}, ticTacToe) })
}


const makeMove = async(params, events) => {
  let ticTacToe = await tts.read(params.game_id)
  ticTacToe.mark(params.square)
  events.push({ move_made: {} })
}


let commandProcessor = new CommandProcessor()
commandProcessor.addCommandHandler('start_game', startGame)
commandProcessor.addCommandHandler('make_move', makeMove)

module.exports = { commandProcessor }
