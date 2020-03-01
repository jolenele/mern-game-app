const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const PORT = process.env.PORT || 4000;
const Message = require('./database/model/Message');
const connectDB = require('./database/config');

//Connect database
connectDB();
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

io.on('connection', socket => {
  // Get the last 20 messages from the database.
  Message.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .exec((err, messages) => {
      if (err) return console.error(err);

      // Send the last messages to the user.
      socket.emit('init', messages);
    });

  // Listen to connected users for a new message.
  socket.on('message', msg => {
    // Create a message with the content and the name of the user.
    const message = new Message({
      content: msg.content,
      username: msg.username,
    });

    // Save the message to the database.
    message.save(err => {
      if (err) return console.error(err);
    });

    // Notify all other users about a new message.
    socket.broadcast.emit('push', msg);
  });

  // Listen on typing
  socket.on('typing', msg => {
    socket.broadcast.emit('typing', { username: msg.username });
  });
});

http.listen(PORT, () => {
  console.log('listening on :' + PORT);
});
