import React from 'react';
// import config from './config';
import io from 'socket.io-client';
// import socketIOClient from 'socket.io-client';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import './App.css';
import ChatBar from './ChatBar';
// const socket = openSocket('http://localhost:3000');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
      content: '',
      username: '',
      // socket: socketIOClient(),
    };
    //this.socket = socketIOClient();
    // let socket = io.connect('http://localhost:3000');
  }

  componentDidMount() {
    // this.socket = io(config[process.env.NODE_ENV].endpoint);

    const socket = io.connect('http://localhost:3000');

    //Listen on new message
    socket.on('new_message', data => {
      this.setState(
        state => ({
          chat: [...state.chat, ...data.content.reverse()],
        }),
        this.scrollToBottom
      );
    });

    // socket.on('new_message', data => {
    //   this.setState(
    //     state => ({
    //       chat: [...state.chat, data],
    //     }),
    //     this.scrollToBottom
    //   );
    // });

    //Listening on typing
    socket.on('typing', data => {
      this.setState(
        state => ({
          chat: data.username + ' is typing...',
        }),
        this.scrollToBottom
      );
    });

    //Emit typing
    // this.content.bind('keypress', () => {
    //   socket.emit('typing');
    // });
  }

  handleContent(event) {
    this.setState({
      content: event.target.value,
    });
  }

  handleName(event) {
    this.setState({
      username: event.target.value,
    });
  }

  // Always scoll to the bottom
  scrollToBottom() {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
  }

  handleSubmit(event) {
    console.log('here is the event : ', event);

    // Prevent the form to reload the current page.
    event.preventDefault();

    const socket = io.connect('http://localhost:3000');

    this.setState(state => {
      // const socket = this.state.socket;
      // console.log(state);
      console.log('this is socket: ', socket);
      socket.emit('new_message', {
        username: this.state.username,
        content: this.state.content,
      });

      return {
        chat: [
          ...state.chat,
          {
            username: state.username,
            content: state.content,
          },
        ],
        content: '',
      };
    }, this.scrollToBottom);
  }

  render() {
    return (
      <div className='App'>
        <Paper id='chat' elevation={3}>
          {this.state.chat.map((msg, index) => {
            return (
              <div key={index}>
                <Typography variant='subtitle2' align='left'>
                  {msg.username}
                </Typography>
                <Typography variant='body1' align='left'>
                  {msg.content}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <ChatBar
          content={this.state.content}
          handleContent={this.handleContent.bind(this)}
          handleName={this.handleName.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          username={this.state.username}
        />
      </div>
    );
  }
}

export default App;
