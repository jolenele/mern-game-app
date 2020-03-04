const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
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
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// error handler
app.use(function(err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

http.listen(PORT, () => {
  console.log('listening on :' + PORT);
});

app.listen = function() {
  let server = http.createServer(this);
  io.listen(server);
  return server.listen.apply(server, arguments);
};

io.on('connection', socket => {
  // Get the last 10 messages from the database.
  Message.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, messages) => {
      if (err) return console.error(err);
      console.log(messages);

      // Send the last messages to the user.
      io.sockets.emit('init', messages);
    });

  // Listen to connected users for a new message.
  socket.on('message', msg => {
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

    io.sockets.emit('push', message);

    // Notify all other users about a new message.
    // socket.broadcast.emit('push', msg);
  });

  // Listen on typing
  socket.on('typing', msg => {
    socket.broadcast.emit('typing', { username: socket.username });
  });
});
