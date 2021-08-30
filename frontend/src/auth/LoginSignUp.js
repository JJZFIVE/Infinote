import React, { useState, useEffect, props } from 'react';
import {login, useAuth, logout, authFetch } from './index';

// Component
export function SignUp(props) {
    const [username, setUsername] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [logged] = useAuth()
  
    const onSubmitClick = (e)=>{
      e.preventDefault()
      console.log("You pressed sign up", username, password1)
      if (username === '' || password1 === '' || password2 === '') {
        console.log("Input fields cannot be blank")
        return null
      }
      if (password1 === password2) {
        let opts = {
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
                  props.func(username);
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
        <div>
          {!logged? <form action="#">
          <h2>Sign Up</h2>
            <div>
              <input type="text" 
                placeholder="Username" 
                onChange={handleUsernameChange}
                value={username} 
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                onChange={handlePassword1Change}
                value={password1}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                onChange={handlePassword2Change}
                value={password2}
              />
            </div>
            <button onClick={onSubmitClick} type="submit">
              Sign Up Now
            </button>
          </form>
          : <div />}
        </div>
      )
  
    
  }




// Component
export function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const [logged] = useAuth();

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
          login(token)
          console.log(token)     
          props.func(username)     
        }
        else {
          console.log("Please type in correct username/password")
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
      <h2>Login</h2>
      {!logged? <form action="#">
        <div>
          <input type="text" 
            placeholder="Username" 
            onChange={handleUsernameChange}
            value={username} 
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        <button onClick={onSubmitClick} type="submit">
          Login Now
        </button>
      </form>
      : <button onClick={() => logout()}>Logout</button>}
    </div>
  )
}