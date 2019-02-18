const mongoose = require('mongoose')
const Schema = mongoose.Schema

const senderSchema = new Schema({
  sender_id: {type: String, index: true},
  email: {type: String, default: ''},
  phone_number: {type: String, default: ''},
  twitter: {type: String, default: ''}
})

module.exports = mongoose.model('Card', senderSchema)
