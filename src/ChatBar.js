import React from 'react';

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import InputBase from '@material-ui/core/InputBase';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(theme => ({
  appBar: {
    bottom: 0,
    top: 'auto',
  },
  inputContainer: {
    // backgroundColor: fade(theme.palette.common.white, 0.15),
    // '&:hover': {
    //   backgroundColor: fade(theme.palette.common.white, 0.25),
    // },
    borderRadius: theme.shape.borderRadius,
    marginLeft: theme.spacing(1),
    position: 'relative',
    width: '100%',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    width: '100%',
  },
}));

export default function ChatBar(props) {
  const classes = useStyles();

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <div className={classes.inputContainer} style={{ maxWidth: '200px' }}>
          <InputBase
            onChange={props.handleName}
            value={props.username}
            placeholder='Type your name'
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'username' }}
          />
        </div>
        <div className={classes.inputContainer}>
          <form onSubmit={props.handleSubmit}>
            <InputBase
              onChange={props.handleContent}
              value={props.content}
              placeholder='Type your message...'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'content' }}
            />
          </form>
        </div>
      </Toolbar>
    </AppBar>
  );
}
