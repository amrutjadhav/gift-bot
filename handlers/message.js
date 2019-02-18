const senderModel = require('../models/sender.js')
const request = require('request-promise-native')

class Message {
  constructor(payload, senderId) {
    this.senderId = senderId
    this.body = payload.message
  }

  async getResponse(chat) {
    let text = this.body.text.trim().toLowerCase()

    let message = ""
    if(text.match(/\w+@\w+\.\w+/)) {
      message = await this.handleEmail()
      chat.say(message, { typing: true })
    } else if(text.match(/^(\+\d{1,3}[- ]?)?\d{10}$/)) {
      message = await this.handlePhoneNumber()
      chat.say(message, { typing: true })
    } else if(text.match(/\@\w+/)) {
      let elements = await this.handleTwitter()
      chat.say("We have found this some gifts 🎁 based upon analysis of your friend's profile. Please have a look.", { typing: true })
      chat.sendGenericTemplate(elements, { typing: true })
    } else if(text == "hello") {
      let elements = await this.handlerEntry()
      chat.say(elements, { typing: true })
      // this.body.text = "@amrutjadhav2294"
      // let elements = await this.handleTwitter()
      // chat.sendGenericTemplate(elements, { typing: true })
    } else {
      chat.say("🤔 I didn't get that", { typing: true })
    }
    return message
  }

  handlerEntry() {
    return new Promise((resolve, reject) => {
      let sender = new senderModel({ sender_id: this.senderId })
      senderModel.findOne({sender_id: this.senderId}, (error, doc) => {
        if(!doc) {
          sender.save((error, doc) => {
            if(error) {
              console.log(error)
              reject(error)
            }
            resolve("Hey, 👋 Hello! Please enter twitter handler of person to whom you want to send gift.")
          })
        } else {
          resolve("Hey, 👋 Hello! Welcome back. Please enter twitter handler of person to whom you want to send gift.")
        }
      })
    })
  }

  handleTwitter() {
    let handler = this.body.text.match(/\@(\w+)/)[1]
    return new Promise((resolve, reject) => {
      senderModel.updateOne({sender_id: this.senderId}, {$set: {twitter: handler}}, (error, doc) => {
        this.getGifts(doc).then(elements => {
          resolve(elements)
        })
      })
    })
  }

  handleEmail() {
    let email = this.body.text.match(/\w+@\w+\.\w+/)[0]
    return new Promise((resolve, reject) => {
      senderModel.updateOne({sender_id: this.senderId}, {$set: {email: email}}, (error, doc) => {
        resolve("Please enter phone number");
      })
    })
  }

  handlePhoneNumber() {
    let number = this.body.text.match(/^(\+\d{1,3}[- ]?)?\d{10}$/)[0]
    return new Promise((resolve, reject) => {
      senderModel.updateOne({sender_id: this.senderId}, {$set: {phone_number: number}}, (error, doc) => {
        resolve("Please enter twitter handler");
      })
    })
  }

  async getGifts(doc) {
    // let results = await this.getIchibaItems()
    let results = await this.getGiftItems()
    // results = this.filterResult(results)
    let elements = this.buildResponse(results)
    return elements
  }

  getFullContactData() {
    request({
      url: 'https://fullcontact-enrich-v1.p.rapidapi.com/person.enrich',
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY
      },
      json: true,
      method: 'POST',
      body: {
        email: doc.email,
        phone: doc.phone_number,
        twitter: doc.twitter
      }
    }).
      then((result) => {
        this.analysisProfile(result)
      }, (error) => {

      })
  }

  analysisProfile(profile) {
    let topics = profile.details.topics.map(function (obj) {
      return obj.name;
    });
  }

  getGiftItems(twitter) {
    return new Promise((resolve, reject) => {
      request({
        url: 'http://127.0.0.1:3001/?twitter=' + twitter,
        json: true,
      }).
        then((results) => {
          resolve(results)
        }, (error) => {
          reject(error)
        })
    })
  }

  getIchibaItems() {
    return new Promise((resolve, reject) => {
      request({
        url: 'https://rakuten_webservice-rakuten-marketplace-item-search-v1.p.rapidapi.com/IchibaItem/Search/20170706?keyword=travel',
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY
        },
        json: true,
        method: 'GET',
      }).
        then((result) => {
          resolve(result['Items'])
        }, (error) => {
          reject(error)
        })
    })
  }

  filterResult(items) {
    let result = []
    let count = 0
    items.forEach((item) => {
      item = item['Item']
      if(item.reviewAverage > 4 && count < 6) {
        result.push(item)
        count++
      }
    })
    return result
  }

  buildResponse(items) {
    items = items.filter((item) => {
      return !Array.isArray(item)
    })

    let count = 0
    let results = []
    items.forEach((item) => {
      count++
      if(count < 9) {
        results.push(item)
      }
    })


    let elements = []
    results.forEach((item) => {
      let element = []
      let caption = item.itemCaption || ""
      element = {
        title: item.itemName.substring(0,75),
        image_url: item.imgURL,
        subtitle: caption.substring(0,75),
        default_action: {
          type: 'web_url',
          url: item.itemURL
        },
        buttons: [
          {
            type: "web_url",
            url: item.itemURL,
            title: "Shop"
          }
        ]
      }
      elements.push(element)
    })
    console.log(elements)
    return elements
  }
}

module.exports = Message
