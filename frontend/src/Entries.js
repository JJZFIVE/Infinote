import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
  } from "react-router-dom";


// Component
export function DeleteEntry(props) {
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
export function ListEntries(props) {
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
              <h3 key={item.id}>{item.name}{item.id}</h3>
          ))}
        </div>
      )
    }
  }

function EntryMain(props) {

    return (
        <div>
            <DeleteEntry username={props.username} />
            <ListEntries username={props.username}/>
        </div>
    )
}

export default EntryMain;