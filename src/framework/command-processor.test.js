'use strict'
/* global jest beforeEach it expect */
import { CommandProcessor } from './command-processor'

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
  // During command processing, any events the command produces are emitted on
  // an SNS topic. Let's mock out the SNS publish function, shall we? It's a
  // little gnarly, as we
  let mockPublish = jest.fn(function(params) {
    return { promise: () => { return Promise.resolve('mocked') } }
  })
  commandProcessor.snsClient.publish = mockPublish

  // add a 'go_faster' command that emits a 'speed_increased' event
  commandProcessor.addCommandHandler('go_faster', (params, events) => {
    events.push({ speed_increased: params.speed_increment })
  })

  // CommandProcessor expects the topic to be set in EVENTS_TOPIC_ARN:
  process.env.EVENTS_TOPIC_ARN = 'myTopicArn'

  // Make the call to handle the command
  let commandMessage = {
    commands: [
      { go_faster: { speed_increment: 100 } }
    ]
  }
  await commandProcessor.handle(commandMessage.commands)

  expect(mockPublish.mock.calls.length).toEqual(1)
  let expectedPublishParams = { Message: '{"speed_increased":100}', TopicArn: 'myTopicArn' }
  expect(mockPublish.mock.calls[0][0]).toEqual(expectedPublishParams)
})
