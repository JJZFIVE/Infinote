import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
//import {login, useAuth, logout, authFetch } from './auth';
//import { Login, SignUp } from './auth/LoginSignUp';
// Change most fetch requests to authfetch


// Component
function DeleteEntry(props) {
  const [entryId, setEntryId] = useState("");

  function onDeleteInputChange(e) {
    setEntryId(e.target.value);
  }

  function onDeleteEntry() {
    if(entryId !== "" && props.username !== "") {
      const opts = {"username": props.username, "entryId": entryId}
      fetch("/api/delete-entry", {
        method: "delete",
        body: JSON.stringify(opts)
      }).then(r => r.json()).then(r => console.log(r)).catch(error => console.log(error));
    }
    else {
      console.log("Enter something into the delete field, dummy")
    }
  }

  return (
    <div>
      <h3>Delete An Entry:</h3> <br />
      <label htmlFor="delete-entry-button">Id of entry:</label>
      <input id="delete-entry-button" placeholder="id" onChange={onDeleteInputChange}></input>
      <button onClick={onDeleteEntry}>Delete</button>
    </div>
  )
}



// Component
function ListEntries(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState([]);

  function updateEntries() {
    let opts = {
        'username': props.username,
      }
    fetch("/api/get-entries", {
        method: "post",
        body: JSON.stringify(opts)
    })
    .then(r => r.json())
    .then((r) => {
        console.log(r.entries);
        setEntries(r.entries);
        setIsLoading(false);
        //props.func(r.notes);
    }) 
  }
  // Turn into useEffect. Modify the [] in the useEffect to add a Hook for when a new entry is added to re-render all of the entries

  if (isLoading) {
    return (
      <div>
        <br />
        <button onClick={updateEntries}>Get entries</button> <br />
        Loading...
      </div>
    )
  }
  else {
    return (
      <div>
            <button onClick={updateEntries}>Get entries</button>
            <h1>Entries:</h1>
            {entries.map(item => (
            <h3 key={item.id}>{item.name}</h3>
        ))}
      </div>
    )
  }
}





// Component
function App() {
  const [myFile, setMyFile] = useState(null);
  const [username, setUsername] = useState("");
  const [filename, setFilename] = useState("");
  const [tags, setTags] = useState("");
  const [entries, setEntries] = useState([]);

  function onFileChange(e) {
    e.preventDefault();
    setMyFile(e.target.files[0]);
    document.getElementById("warning-text").innerHTML = "";
  }

  function onUsernameChange(e) {
    setUsername(e.target.value);
    document.getElementById("warning-text").innerHTML = "";
  }

  function onFilenameChange(e) {
    e.preventDefault();
    setFilename(e.target.value);
    document.getElementById("warning-text").innerHTML = "";
  }

  function onTagsChange(e) {
    setTags(e.target.value);
    document.getElementById("warning-text").innerHTML = "";
  }

  function onFileUpload() {
    const fd = new FormData();
    fd.append("username", username);
    fd.append("filename", filename);
    fd.append("tags", tags);
    fd.append("file", myFile);
    for (let pair of fd) {
      console.log(pair[0] + ", " + pair[1]);
    }
    if (username !== '' && filename !== '' && myFile !== null){
      fetch("/api/upload-entry", {
        method: "POST",
        body: fd
      }).then(r => r.json()).then(r => console.log(r)).catch(error => console.log(error))
    }
    else {
      document.getElementById("warning-text").innerHTML = "Please upload valid fields";
    }
  }

  return (
    <div className="App">
      <div>
          <input type="file" onChange={onFileChange} />
          <label htmlFor="username">Username: </label>
          <input id="username" type="text" onChange={onUsernameChange} />
          <label htmlFor="filename">Entry Name: </label>
          <input id="filename" type="text" onChange={onFilenameChange} />
          <label htmlFor="tags">(optional) Tags: </label>
          <input id="tags" type="text" onChange={onTagsChange} />
          <button onClick={onFileUpload}>
              Upload!
          </button>
        </div>
      <div>
        <h3 id="warning-text"></h3>
      </div>
      
      <DeleteEntry username={username} />
      <ListEntries username={username} />
    </div>

  );
}

export default App;
