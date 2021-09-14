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
import Home from './Home.js';

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

  function FeedbackForm() {
    useEffect(() => {
      window.location.replace('https://forms.gle/cj7ToH5QzSQYJWJY8')
    }, [])
    return null;
  }

  function AlphaSignUp() {
    useEffect(() => {
      window.location.replace('https://forms.gle/ba4rrcYBdzZzECp98')
    }, [])
    return null;
  }

  
  return (
    <div className="App">
      <Router>
        <Layout username={username} logged={logged} usernameFunc={usernameCallback}>
          <Switch>
            <Route exact path="/">
              <Home />
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
            <Route exact path='/feedback' >
              <FeedbackForm />
            </Route>
            <Route exact path="/alpha-sign-up">
              <AlphaSignUp />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </div>

  );
}

export default App;
