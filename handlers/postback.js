const senderModel = require('../models/sender.js')

class PostBack {
  constructor(body, senderId) {
    this.body = body
    this.senderId = senderId
  }

  getResponse() {
    let payload = this.body.payload
    let message = ""
    // if(payload == "GET_STARTED") {
    message = this.handleGetStarted()
    // }
    return message
  }

  handleGetStarted() {
    let sender = new senderModel({ sender_id: this.senderId })
    sender.save((error, doc) => {
      if(error) {
        console.log(err)
      }
      return {
        "text": "Please enter email address."
      }
    })
  }
}

module.exports = PostBack
