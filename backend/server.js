const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
// const path = require('path');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 4000;
const Message = require('./database/model/Message');
const connectDB = require('./database/config');

//Connect database
connectDB();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// app.use(express.static(path.join(__dirname, '../public/index.html')));

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', socket => {
  socket.on = 'Anonymous';
  console.log('Socket connected');

  socket.on('change_username', data => {
    socket.username = data.username;
  });

  // Get the last 10 messages from the database.
  Message.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, messages) => {
      if (err) return console.error(err);
      console.log(messages);

      // Send the last messages to the user.
      io.sockets.emit('new_message', messages);
    });

  // Listen to connected users for a new message.
  socket.on('new_message', msg => {
    console.log('NEW MESSAGE : ' + msg);
    // Create a message with the content and the name of the user.
    const message = new Message({
      content: msg.content,
      username: msg.username,
    });

    // Save the message to the database.
    message.save(err => {
      if (err) return console.error('erroooooor');
    });

    io.sockets.emit('new_message', message);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
