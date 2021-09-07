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
import Settings from './Settings.js';

// Component
export function Home(props) {
  const [logged] = useAuth();

  return (
    <div>
      <h3>Home</h3>
      <h4>I'm gonna put all of my amazing homepage stuff right here</h4>
    </div>
  )
}



// App Component
function App() {
  const [username, setUsername] = useState("");
  const [logged] = useAuth();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
      setUsername(loggedInUser);
      console.log("Username:", loggedInUser);
    }
  }, [username]);
  
  function usernameCallback(data) {
    setUsername(data);
  }

  return (
    <div className="App">
      <Router>
        <Layout username={username} logged={logged} usernameFunc={usernameCallback}>
          <Switch>
            <Route exact path="/">
              <Home usernameFunc={usernameCallback} />
            </Route>
            <Route exact path="/login">
              <Login username={username} usernameFunc={usernameCallback}></Login>
            </Route>
            <Route exact path="/sign-up">
              <SignUp username={username} usernameFunc={usernameCallback}></SignUp>
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
