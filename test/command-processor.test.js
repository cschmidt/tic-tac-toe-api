'use strict'
/* global jest beforeEach it expect */
import { CommandProcessor } from '../src/command-processor'

let commandProcessor = {}

beforeEach(() => {
  commandProcessor = new CommandProcessor()
})

it('can add a command handler', () => {
  commandProcessor.addCommandHandler('go_faster', (command, events) => {})
  expect(commandProcessor.handlerFor({ go_faster: {} })).toBeDefined()
})

it('ensures the command handler is a function', () => {
  expect(() => { commandProcessor.addCommandHandler('goFaster', 'not a function') })
    .toThrowError()
})

it('ensures the command handler signature expects two args', () => {
  expect(() => { commandProcessor.addCommandHandler('goFaster', () => {}) })
    .toThrowError()
  expect(() => { commandProcessor.addCommandHandler('goFaster', (arg1) => {}) })
    .toThrowError()
  expect(() => { commandProcessor.addCommandHandler('goFaster', (arg1, arg2, arg3) => {}) })
    .toThrowError()
})

it('can process a command', async() => {
  commandProcessor.addCommandHandler('go_faster', (command, events) => {
    events.push({ speed_increased: command.go_faster.speed_increment })
  })
  let commandMessage = {
    commands: [
      { go_faster: { speed_increment: 100 } }
    ]
  }
  let handler = commandProcessor.handlerFor(commandMessage.commands[0])
  expect(handler).toBeDefined()
  await commandProcessor.handle(commandMessage.commands)
})
