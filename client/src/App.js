import React from 'react';
// import config from './config';
//import io from 'socket.io-client';
import socketIOClient from 'socket.io-client';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import './App.css';
import ChatBar from './ChatBar';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
      content: '',
      username: '',
      endpoint: 'http://localhost:3000/',
    };
    // this.socket = socketIOClient();
  }

  connectSocket() {
    //const socket = socketIOClient.connect();
    const socket = socketIOClient.connect(this.state.endpoint);
    return socket;
  }

  componentDidMount() {
    // this.socket = io(config[process.env.NODE_ENV].endpoint);
    const { endpoint } = this.state.endpoint;
    const socket = socketIOClient.connect(endpoint);
    socket.on('new_message', msg => {
      this.setState(
        state => ({
          chat: [...state.chat, ...msg.reverse()],
        }),
        this.scrollToBottom
      );
    });

    // this.socket.emit('new_message', msg => {
    //   this.setState(
    //     state => ({
    //       chat: [...state.chat, msg],
    //     }),
    //     this.scrollToBottom
    //   );
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
    console.log(event);
    const { endpoint } = this.state.endpoint;
    const socket = socketIOClient(endpoint);

    // Prevent the form to reload the current page.
    event.preventDefault();

    this.setState(state => {
      console.log(state);
      console.log('this is socket ', socket);
      socket.emit('new_message', {
        username: this.state.username,
        content: this.state.content,
      });
      socket.on('new_message', msg => {
        this.setState(
          state => ({
            chat: [...state.chat, ...msg.reverse()],
          }),
          this.scrollToBottom
        );
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
