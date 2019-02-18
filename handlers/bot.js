const postbackHandler = require('./postback.js')
const messageHandler = require('./message.js')
const request = require('request-promise-native')

class BotHandler {
  constructor(body) {
    console.log('here is body')
    console.log(body)
    this.sender = body.sender.id
    if(body.message) {
      this.messageHandler(body.message, this.sender)
    } else if(body.postback) {
      this.postbackHandler(body.postback, this.sender)
    }
  }
  messageHandler(body) {
    let handler = new messageHandler(body)
    let message = handler.getResponse()
    this.sendResponse(message)
  }
  postbackHandler(body) {
    let handler = new postbackHandler(body)
    let message = handler.getResponse()
    this.sendResponse(message)
  }

  sendResponse(message) {
    let body = {
      "recipient": {
        "id": this.sender
      },
      "message": message
    }
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.FB_PAGE_ACCESS_TOKEN,
      method: 'POST',
      body: body,
      json: true
    })
      .then((result) => {
        console.log('sent')
      }, (error) => {
        console.log(error.response.body)
      })
      .catch((error) => {
        console.log(error.response.body)
      })
  }
}

module.exports = BotHandler
