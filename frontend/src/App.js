import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import { DeleteEntry, ListEntries } from './Entries.js';
import Upload from './Upload.js';
import EntryMain from './Entries.js';
import {login, useAuth, logout, authFetch } from './auth';
import { Login, SignUp } from './auth/LoginSignUp';

// Component
function Home(props) {

  //const [logged, setLogged] = useState(null);
  const [username, setUsername] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [logged] = useAuth();

  useEffect(() => {
    props.usernameFunc(username);
  }, [username])

  function usernameCallback(data) {
    setUsername(data);
  }

  function showLoginCallback(data) {
    setShowLogin(data);
  }
  return (
    <div>
      <h3>Home</h3>
      {showLogin ? 
      <Login usernameFunc={usernameCallback} showLoginFunc={showLoginCallback} /> 
      : <SignUp usernameFunc={usernameCallback} showLoginFunc={showLoginCallback} />}
    </div>
  )
}

// Component
function Navbar(props) {
  const [logged] = useAuth();

  return (
    <nav>
      {logged ? 
      <ul>
          <li>
            <Link to="/upload">Upload</Link>
          </li>
          <li>
            <Link to="/entries">Entries</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul> 
        : <div></div>}
      
    </nav>
  )
}

function Settings() {
  return (
    <div>
      <h3>Settings</h3>
    </div>
  )
}


// App Component
function App() {
  const [username, setUsername] = useState("");
  const [logged] = useAuth();
  
  function usernameCallback(data) {
    setUsername(data);
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home usernameFunc={usernameCallback} />
          </Route>
          <Route path="/upload">
            <Upload username={username}/>
          </Route>
          <Route path="/entries">
            <EntryMain username={username}/>
          </Route>
          <Route path="/settings">
            <Settings username={username}/>
          </Route>
        </Switch>
      </Router>
    </div>

  );
}

export default App;
