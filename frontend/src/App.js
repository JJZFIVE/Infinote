import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Upload from './Upload.js';
import EntryMain from './Entries.js';
import { useAuth } from './auth';
import { Login, SignUp } from './auth/LoginSignUp';
import Layout from './Layout.js';
import ViewEntry from './ViewEntry.js';

// Component
export function Home(props) {

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
        <Layout username={username} logged={logged}>
          <Switch>
            <Route exact path="/">
              <Home usernameFunc={usernameCallback} />
            </Route>
            <Route path="/upload">
              <Upload username={username}/>
            </Route>
            <Route exact path="/entries">
              <EntryMain username={username}/>
            </Route>
            <Route path="/settings">
              <Settings username={username}/>
            </Route>
            <Route path="/entries/:entry_id">
              <ViewEntry username={username}/>
            </Route>
          </Switch>
        </Layout>
      </Router>
    </div>

  );
}

export default App;
