import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
  appBar: {
    bottom: 0,
    top: 'auto',
    background: '#2E3B55',
  },
  container: {
    marginLeft: theme.spacing(1),
    position: 'relative',
    width: '100%',
  },
  root: {
    color: 'inherit',
  },
  input: {
    padding: theme.spacing(1, 1, 1, 1),
    width: '100%',
  },
}));

export default function ChatBar(props) {
  const classes = useStyles();

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <div className={classes.container} style={{ maxWidth: '100px' }}>
          <InputBase
            onChange={props.handleName}
            value={props.username}
            placeholder='Your name'
            classes={{
              root: classes.root,
              input: classes.input,
            }}
            inputProps={{ 'aria-label': 'username' }}
          />
        </div>
        <div className={classes.container}>
          <form onSubmit={props.handleSubmit}>
            <InputBase
              onChange={props.handleContent}
              value={props.content}
              placeholder='Type your message...'
              classes={{
                root: classes.root,
                input: classes.input,
              }}
              inputProps={{ 'aria-label': 'content' }}
            />
          </form>
        </div>
      </Toolbar>
    </AppBar>
  );
}
