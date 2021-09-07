import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {login, useAuth } from './index';


// Component
export function SignUp(props) {
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const history = useHistory();
    const [logged] = useAuth();
  
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
        <div>
          {!logged? <div><form action="#">
          <h2>Sign Up</h2>
            <div>
              <input type="text" 
                placeholder="First Name" 
                onChange={handleFirstnameChange}
                value={firstname} 
              />
            </div>
            <div>
              <input type="text" 
                placeholder="Email" 
                onChange={handleEmailChange}
                value={email} 
              />
            </div>
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
          <div>
            <button onClick={() => history.push("/login")}>Go to Login</button>
          </div>
          </div>
          : <div />}
        </div>
      )
  
    
  }




// Component
export function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
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
          login(token);
          console.log(token);
          props.usernameFunc(username);
          // Store username in localstorage
          localStorage.setItem('username', username);
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
      {!logged? <div>
        <h2>Login</h2>
        <form action="#">
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
      <div>
      < button onClick={() => history.push("/sign-up")}>Go to Sign Up</button>
      </div>
      </div>
      : <h3>Welcome to Infinote</h3>}
    </div>
  )
}