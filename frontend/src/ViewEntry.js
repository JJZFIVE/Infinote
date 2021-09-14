import React, {useEffect, useState} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { authFetch, useAuth } from './auth';
import { makeStyles } from '@material-ui/core';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
    textField: {
      marginTop: 20,
      marginBottom: 20,
      align: "center",
      display: "block"
    },
    welcomeToInfinote: {
        marginTop: 50,
        marginBottom: 20,
        align: "center",
        display: "block"
    },
    getStartedButton: {
        marginTop: 20,
        marginBottom: 30,
        align: "center",
    },
    paper: {
        display: 'flex',
        '& > *': {
          margin: 5
        },
        backgroundColor: "#EAEAEA"
    },
    alert: {
        width: '100%',
      },
  })

export default function ViewEntry({username}) {
    const classes = useStyles();
    const { entry_id } = useParams();
    const history = useHistory();
    const [logged] = useAuth();
    const [audioURL, setAudioURL] = useState(null);
    const[name, setName] = useState("");
    const [registeredDate, setRegisteredDate] = useState("");

    useEffect(() => {
        if(!logged) {
            history.push("/login");
        }
    }, []);

    useEffect(() => {
        authFetch(`/api/get-entry-file/${username}/${entry_id}`)
        .then((r) => r.json()).then(r => {
            console.log(r);
            const data  = r.test;
            const raw = window.atob(data);
            const binaryData = new Uint8Array(new ArrayBuffer(raw.length));
            for (let i = 0; i < raw.length; i++) {
                binaryData[i] = raw.charCodeAt(i);
            }
            const blob = new Blob([binaryData], {'type': 'audio/mp3'});
            setAudioURL(URL.createObjectURL(blob));

        });
        authFetch(`/api/get-entry-info-by-id/${entry_id}`)
        .then(r => r.json()).then(r => {
            setName(r.name);
            setRegisteredDate(r.registeredDate)
        })
    
    }, [])

    return (

        <div>
            <Grid container direction="column" alignItems="center" justifyContent="center">
                
                <Typography className={classes.welcomeToInfinote} variant="h4">Name: {name}</Typography>
                <Typography variant="h4">Date: {registeredDate}</Typography>
           
                {/* <audio controls={true} type="audio" src={audioURL}></audio>*/}
                <AudioPlayer
                src={audioURL}
                className={classes.welcomeToInfinote}
                onPlay={e => console.log("onPlay")}
                // other props here
                />
                <Typography className={classes.welcomeToInfinote} variant="h5">Upcoming Beta functionality: transcribed text file</Typography>
            </Grid>
        </div>
    )
}