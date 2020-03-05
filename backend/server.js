const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// const http = require('http').Server(app);
const path = require('path');
// const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
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
// app.use(express.static(path.join(__dirname, '..', 'public')));

//middlewares
app.use(express.static('../src'));

//routes
app.get('/', (req, res) => {
  res.type('html');
  res.sendFile(path.join(__dirname, '../public/index.html'));

  // res.render('../public/index.html');
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

// http.listen(PORT, () => {
//   console.log('listening on :' + PORT);
// });

// app.listen = function() {
//   let server = http.createServer(this);
//   io.listen(server);
//   return server.listen.apply(server, arguments);
// };

// const server = app.listen(PORT, () => {
//   console.log('Connected to port ' + PORT);
// });
const io = require('socket.io');

io.on('connection', socket => {
  console.log('New user connected');

  //default username
  socket.username = 'Anonymous';

  // Get the last 10 messages from the database.
  Message.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, messages) => {
      if (err) return console.error(err);
      console.log('Message from database: ', messages);

      // Send the last messages to the user.
      io.sockets.emit('new_message', messages);
    });

  // Listen to connected users for a new message.
  socket.on('new_message', data => {
    console.log('NEW MESSAGE : ' + data);
    // Create a message with the content and the name of the user.
    const message = new Message({
      content: data.content,
      username: socket.username,
    });

    io.sockets.emit('new_message', message);

    // Save the message to the database.
    message.save(err => {
      if (err) return console.error('erroooooor');
    });
  });

  //listen on typing
  socket.on('typing', data => {
    socket.broadcast.emit('typing', { username: socket.username });
  });
});

app.listen(3000);
io.listen(3000);
