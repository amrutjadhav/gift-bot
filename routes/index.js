var express = require('express');
var router = express.Router();
const botHandler = require('../handlers/bot.js')
const request = require('request-promise-native')
const BootBot = require('bootbot');

// const bot = new BootBot({
//   accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
//   verifyToken: 123,
//   appSecret: '470d291ea5c472ff709b6358843a1b88'
// });


// let typingOn = (senderId) => {
//   request({
//     uri: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.FB_PAGE_ACCESS_TOKEN,
//     method: 'POST',
//     body: {
//       recipient:{
//         id: senderId
//       },
//       sender_action: "typing_on"
//     },
//     json: true
//   })
//     .then((result) => {
//       console.log('typing sent')
//     }, (error) => {
//       console.log(error.response.body)
//     })
//     .catch((error) => {
//       console.log(error.response.body)
//     })
// }


// // Adds support for GET requests to our webhook
// router.get('/', (req, res) => {

//   // Your verify token. Should be a random string.
//   let VERIFY_TOKEN = "123"

//   // Parse the query params
//   let mode = req.query['hub.mode'];
//   let token = req.query['hub.verify_token'];
//   let challenge = req.query['hub.challenge'];

//   // Checks if a token and mode is in the query string of the request
//   if (mode && token) {

//     // Checks the mode and token sent is correct
//     if (mode === 'subscribe' && token === VERIFY_TOKEN) {

//       // Responds with the challenge token from the request
//       console.log('WEBHOOK_VERIFIED');
//       res.status(200).send(challenge);

//     } else {
//       // Responds with '403 Forbidden' if verify tokens do not match
//       res.sendStatus(403);
//     }
//   }
// });

// router.post('/', (req, res, next) => {
//   let messaging = req.body.entry[0].messaging[0]
//   console.log(messaging)
//   // typingOn(messaging.sender.id);
//   new botHandler(messaging)
// })

module.exports = router;
