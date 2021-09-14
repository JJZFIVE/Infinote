import React, { useState, useEffect } from 'react';
import { authFetch, useAuth } from './auth';
import { useHistory } from 'react-router-dom';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import EntryCard from "./EntryCard.js";

const useStyles = makeStyles({
  headerText: {
    marginTop: 20,
    marginBottom: 20,
    align: "center",
    display: "block"
  },
})

// Component
export function DeleteEntry(props) {
    const classes = useStyles();
    const [entryId, setEntryId] = useState("");
  
    function onDeleteInputChange(e) {
      setEntryId(e.target.value);
    }
  
    function onDeleteEntry() {
      if(entryId !== "" && props.username !== "") {
        const opts = {"username": props.username, "entryId": entryId}
        authFetch("/api/delete-entry", {
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
function EntryMain(props) {
    const classes = useStyles();
    const [entries, setEntries] = useState([]);
    const history = useHistory();
    const [logged] = useAuth();

    useEffect(() => {
      if(!logged){
        history.push("/login");
      }
    }, []);

    useEffect(() => {
      const opts = {
        'username': props.username,
      }
      authFetch("/api/get-entries", {
        // Try to change this to get request to url `/api/get-entries/${props.username}`
          method: "post",
          body: JSON.stringify(opts)
      })
      .then(r => r.json())
      .then((r) => {
          console.log(r.entries);
          setEntries(r.entries);
      })
    }, [])

    const deleteEntry = (entry_id) => {
      const opts = {"username": props.username, "entryId": entry_id}
      authFetch("/api/delete-entry", {
        method: "delete",
        body: JSON.stringify(opts)
      }).then(r => r.json()).then(r => console.log(r)).catch(error => console.log(error));

      const newEntries = entries.filter(entry => entry.id != entry_id);
      setEntries(newEntries);
    }

    return (
      <div>
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="primary" className={classes.headerText}>My Journal Entries</Typography>
        </Grid>
        <Container>
          <Grid container spacing={3}>
            {entries.map((item) => (
              <Grid item key={item.id} xs={12} md={6} lg={4}>
                <EntryCard entry={item} deleteEntry={deleteEntry}/>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    )
}

export default EntryMain;