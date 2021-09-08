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
import Paper from '@material-ui/core/Paper';
import { Alert } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

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
export function SignUp(props) {
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const history = useHistory();
    const [logged] = useAuth();
    const classes = useStyles();
  
    const onSubmitClick = (e)=>{
      e.preventDefault()
      if (firstname === '' || email === '' || username === '' || password1 === '' || password2 === '') {
        console.log("Input fields cannot be blank")
        return null
      }
      if (password1 === password2) {
        let opts = {
          'firstname': firstname,
          'email': email,
          'username': username,
          'password': password1
        }
        console.log(opts)
        fetch('/api/sign_up', {
          method: 'post',
          body: JSON.stringify(opts)
        })
        .then(r => r.json()).then((r) => {
          console.log(r);
          // This just logs in the user after creating a new user
          if (r.message === "User created successfully!") {
            fetch('/api/login', {
              method: 'post',
              body: JSON.stringify(opts)
            }).then(r => r.json())
              .then(token => {
                if (token.access_token){
                  login(token);
                  console.log(token);
                  props.usernameFunc(username);
                  // Store username in localstorage
                  localStorage.setItem('username', username);
                  history.push("/entries");
                } else {
                  console.log("Please type in correct username/password")
                }
              })
          }
        });
      }
      else {
        console.log("PASSWORDS DO NOT MATCH")
      }
    }
      const handleFirstnameChange = (e) => {
        setFirstname(e.target.value)
      }

      const handleEmailChange = (e) => {
        setEmail(e.target.value)
      }
  
      const handleUsernameChange = (e) => {
        setUsername(e.target.value)
      }
    
      const handlePassword1Change = (e) => {
        setPassword1(e.target.value)
      }
  
      const handlePassword2Change = (e) => {
        setPassword2(e.target.value)
      }
    
      return (
      <div className={classes.marginAutoContainer}>
        {!logged? 
        <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: "90vh" }}>
          
          <form action="#">
          
          <Typography variant="h3" color="primary">Sign Up</Typography>


          <TextField 
              className={classes.textField}
              label="First Name"
              variant="outlined"
              color="secondary"
              required
              value={firstname}
              onChange={handleFirstnameChange}
            />

          <TextField 
              className={classes.textField}
              label="Email"
              variant="outlined"
              color="secondary"
              required
              value={email}
              onChange={handleEmailChange}
            />

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
              value={password1}
              onChange={handlePassword1Change}
            />

          <TextField 
              className={classes.textField}
              label="Confirm Password"
              type="password"
              variant="outlined"
              color="secondary"
              required
              value={password2}
              onChange={handlePassword2Change}
            />    

          <Button
            variant="contained"
            component="label"
            color="primary"
            onClick={onSubmitClick}
            >
            Sign Up
          </Button>
          </form>
          <br />
          <Button
            variant="contained"
            component="label"
            color="secondary"
            onClick={() => history.push("/login")}
            >
            Go To Login
          </Button>


        </Grid>
          : <Typography variant="h4" color="primary">You're already logged in</Typography>}
        </div>
      )
  
    
  }




// Component
export function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const [logged] = useAuth();
  const classes = useStyles();

  const onSubmitClick = (e)=>{
    e.preventDefault()
    console.log("You pressed login")

    let opts = {
      'username': username,
      'password': password
    }
    console.log(opts)
    fetch('/api/login', {
      method: 'post',
      body: JSON.stringify(opts)
    }).then(r => r.json())
      .then(token => {
        if (token.access_token){
          login(token);
          console.log(token);
          props.usernameFunc(username);
          // Store username in localstorage
          localStorage.setItem('username', username);
          history.push("/entries");
        }
        else {
          console.log("Please type in correct username/password");
        }
      })    
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div>
      {!logged ? <div>
        <Typography variant="h3" color="primary">Login</Typography>
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

        <Button
            variant="contained"
            component="label"
            color="primary"
            onClick={onSubmitClick}
            >
            Log In
          </Button>

      </form>
      <br />
      <Button
            variant="contained"
            component="label"
            color="secondary"
            onClick={() => history.push("/sign-up")}
            >
            Go To Sign Up
          </Button>


      </div>
      : <Typography variant="h4" color="primary">You're already logged in</Typography> }
    </div>
  )
}