'use strict'
const S3 = require('aws-sdk/clients/s3')
const { TicTacToe } = require('./tic-tac-toe')
const nanoid_en = require('nanoid-good/locale/en')
const nanoid = require('nanoid-good')(nanoid_en)

class TicTacToeStore {
  constructor(bucket) {
    this.s3 = new S3()
    this.bucket = bucket
  }

  async create() {
    const game = new TicTacToe()
    game.id = nanoid()
    // TODO: maybe do a uniqueness check? We're using an id generation mechanism
    // that we expect will avoid collisions, however, it's not impossible. Also,
    // here's an interesting area to add some smarts. We want user-exposed ids to
    // be concise, so could we start with a small-ish number of bits, and then
    // expand that as necessary?

    await this.s3
      .putObject(this.s3ParamsFor(game))
      .promise()
    return game
  }

  async read(id) {
    const s3Params = {
      Bucket: this.bucket,
      Key: this.key(id)
    }
    const s3Object = await this.s3
      .getObject(s3Params)
      .promise()
    return Object.assign(new TicTacToe(), JSON.parse(s3Object.Body))
  }

  async update(game) {
    await this.s3
      .putObject(this.s3ParamsFor(game))
      .promise()
    return game
  }

  key(id) {
    return `games/${id}`
  }

  s3ParamsFor(game) {
    return {
      ACL: 'authenticated-read',
      Bucket: this.bucket,
      Key: this.key(game.id),
      Body: JSON.stringify(game)
    }
  }
}

module.exports = { TicTacToeStore }
