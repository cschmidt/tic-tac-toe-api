'use strict'

/* global jest beforeEach it expect */
const { SessionManager } = require('./session-manager')
let sessionManager = {}
let systemName = "MySystem"

beforeEach(() => {
  sessionManager = new SessionManager(systemName)
})

it('can initialize', () => {
    expect(sessionManager).toBeInstanceOf(SessionManager)
})
  
  