/**
 * Chat
 *
 * @module      :: Model
 * @description :: Represent data model for the Chat
 * @author		:: Rajesh
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Chat = new Schema({

  name:    {
    type    : String,
    require : true
  },
  message:    {
    type    : String,
    require : true
  },
  modified: {
    type    : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('Chat', Chat);