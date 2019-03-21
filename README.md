# tic-tac-toe-api

[![Gitter](https://badges.gitter.im/tic-tac-toe-api/Lobby.svg)](https://gitter.im/tic-tac-toe-api/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![AWS CodeBuild Status](https://codebuild.us-west-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiaGJ4a09aYzl2UG9TTGJOZDg4RWhUZTFoWWcvOWFoSkZxSFhZUW93dW5BamFvZU10eVBVS0g3QlAyeVVzRXE1Vk1WbDdOZWRGOWVkK3c2UGE3VDBXS29VPSIsIml2UGFyYW1ldGVyU3BlYyI6IjRDYWlPRDBMdFBmbDEyZEkiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

Well hello!

This is a personal project I've been working on, just exploring what's possible
with serverless (just happen to be using Serverless Framework) and heavily
asynchronous approaches.

Eventually I'll split this module into two; one that's specific to Tic Tac Toe
functionality, and then one for the "framework" portions (assuming there's any
significant value in said framework).

## Running
As a personal project, I've not put much effort into making this deployable by
others (yet), but it goes something like this:

* Set yourself up with an AWS account and the command line tools
* [Install Servless ](https://serverless.com/framework/docs/getting-started/)
* (somehow solve resource naming conflicts in serverless.yml)
* Run `$ serverless deploy`. You should see a bunch of output that looks
  something like this:

  ```
  Serverless: Stack update finished...
  Service Information
  service: tic-tac-toe-api
  stage: dev
  region: us-west-2
  stack: tic-tac-toe-api-dev
  resources: 41
  api keys:
    None
  endpoints:
    GET - https://u6d07hxpr6.execute-api.us-west-2.amazonaws.com/dev/sample
    wss://38t51ncco1.execute-api.us-west-2.amazonaws.com/dev
  functions:
    Sample: tic-tac-toe-api-dev-Sample
    Sessions: tic-tac-toe-api-dev-Sessions
    CommandReceiver: tic-tac-toe-api-dev-CommandReceiver
    CommandProcessor: tic-tac-toe-api-dev-CommandProcessor
    EventDispatch: tic-tac-toe-api-dev-EventDispatch
  layers:
    None
  ```
* Note the websockets URL under "endpoints" and run `wscat -c [wss endpoint]`
* You can then start a new game:
  ```
  > {"commands":[{"start_game": {}}]}
  ```
  If everything's working as expected, you should get a `game_started` event
  returned to you. Make note of the game id.
* You can make a move with:
  ```
  > {"commands":[{"make_move": {"game_id": "[game id from game_started]", "square": "a1", "mark": "X", "move_number": 1}}]}
  ```