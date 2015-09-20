/**
 * Chat
 *
 * @module      :: Routes
 * @description :: Represent data model for the Chat
 * @author      :: Rajesh
 */

var Chat = require('../models/chat.js');

module.exports = function(app) {

  /**
   * Find and retrieves all Chats
  */
  findAllChats = function(req, res) {
    console.log("GET - /Chats");
    return Chat.find(function(err, Chats) {
      if(!err) {
        return res.send(Chats);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find limited Chats
  */
  limitedChats = function(req, res) {
    console.log("GET - /Chats-limit");
    var chats = Chat.find({});
    chats.limit(100);
    chats.skip(0);
    return chats.exec(function(err, Chats) {
      if(!err) {
        return res.send(Chats);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Find and retrieves a single chat by its ID
   */
  findById = function(req, res) {

    console.log("GET - /chat/:id");
    return Chat.findById(req.params.id, function(err, chat) {

      if(!chat) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if(!err) {
        return res.send({ status: 'OK', chat:chat });
      } else {

        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };

  /**
   * Creates a new chat from the data request
   */
  addChat = function(req, res) {

    console.log('POST - /chat');

    var chat = new Chat({
      name:    req.body.name,
      message: req.body.message
    });

    chat.save(function(err) {
      if(err) {
        console.log('Error while saving chat: ' + err);
        res.send({ error:err });
        return;
      } else {
        console.log("chat created");
        //return res.send({ status: 'OK', chat:chat });
        return;
      }
    });
  };

  /**
   * Update a chat by its ID
   */
  updateChat = function(req, res) {

    console.log("PUT - /chat/:id");
    return Chat.findById(req.params.id, function(err, chat) {

      if(!chat) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      if (req.body.name != null) chat.name = req.body.name;
      if (req.body.message != null) chat.message = req.body.message;

      return chat.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', chat:chat });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }
        res.send(chat);
      });
    });
  };

  /**
   * Delete a chat by its ID
   */
  deleteChat = function(req, res) {

    console.log("DELETE - /chat/:id");
    return Chat.findById(req.params.id, function(err, chat) {
      if(!chat) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }

      return chat.remove(function(err) {
        if(!err) {
          console.log('Removed chat');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }

  //Link routes and actions
  app.get('/chat', findAllChats);
  app.get('/chat-limit', limitedChats);
  app.get('/chat/:id', findById);
  app.post('/chat', addChat);
  app.put('/chat/:id', updateChat);
  app.delete('/chat/:id', deleteChat);

}