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
// Change most fetch requests to authfetch


function Home() {
  return (
    <div>
      <h3>Home</h3>
    </div>
  )
}

function Navbar(props) {
  const [logged, setLogged] = useState(false);


  return (
    <nav>
      <ul>
          {logged ? <li><Link></Link></li> : <h1></h1>}
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
  
  function usernameCallback(data) {
    setUsername(data);
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/upload">
            <Upload username={username} func={usernameCallback}/>
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
