import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {login, useAuth } from './index';
// Material UI Component imports
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
  textField: {
    marginTop: 20,
    marginBottom: 20,
    align: "center",
    display: "block"
  },
  welcomeToInfinote: {
      marginTop: 50,
      marginBottom: 20,
      align: "center",
      display: "block"
  },
  getStartedButton: {
      marginTop: 20,
      marginBottom: 30,
      align: "center",
  },
  paper: {
      display: 'flex',
      '& > *': {
        margin: 5
      },
      backgroundColor: "#EAE5E4"
  },
  alert: {
      width: '100%',
    },
})

// Component
export function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const [logged] = useAuth();
  const classes = useStyles();

  const onSubmitClick = (e)=>{
    e.preventDefault()
    let opts = {
      'username': username,
      'password': password
    }
    fetch('/api/login', {
      method: 'post',
      body: JSON.stringify(opts)
    }).then(r => r.json())
      .then(token => {
        if (token.access_token){
          login(token);
          props.usernameFunc(username);
          // Store username in localstorage
          localStorage.setItem('username', username);
          history.push("/entries");
        }
        else {
          document.getElementById("warning-text").innerHTML = "Please type in correct username/password";
        }
      })    
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    document.getElementById("warning-text").innerHTML = "";
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    document.getElementById("warning-text").innerHTML = "";
  }

  return (
    <div>
      {!logged ? <div>
        <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: "70vh" }}>
        <Typography variant="h3" color="primary">Login</Typography>
        <br /> 
        <Container maxWidth="sm">
          <Typography variant="subtitle1" color="textSecondary">If you were accepted into the Alpha, your submitted username will work with password = "password". You can change your password in Settings.</Typography>
        </Container>
        <form action="#" noValidate autoComplete="off">

        <TextField 
              className={classes.textField}
              label="Username"
              variant="outlined"
              color="secondary"
              required
              value={username}
              onChange={handleUsernameChange}
            />
          
        <TextField 
              className={classes.textField}
              label="Password"
              type="password"
              variant="outlined"
              color="secondary"
              required
              value={password}
              onChange={handlePasswordChange}
            />
      </form>
      <Button
            variant="contained"
            component="label"
            color="primary"
            onClick={onSubmitClick}
            >
            Log In
          </Button>
        <Typography variant="subtitle1" id="warning-text" color="error"></Typography>
      </Grid>


      </div>
      : <Typography variant="h4" color="primary">You're already logged in</Typography> }
    </div>
  )
}