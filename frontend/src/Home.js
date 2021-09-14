import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// Material UI imports
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import infinoteLogo from './assets/InfinoteLogo.jpg';
import Paper from '@material-ui/core/Paper';
import { Alert } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

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

export default function Home() {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const history = useHistory();

    return (
      <div>
        <Collapse in={open}>
            <Alert
            className={classes.alert}
            severity="info"
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setOpen(false);
                }}
                >
                <CloseIcon fontSize="inherit" />
                </IconButton>
                }
            >
            Infinote is currently in <strong>Closed Alpha.</strong> Press Get Started to apply.
            </Alert>
      </Collapse>

      
          <Grid container direction="column" alignItems="center" justifyContent="center">
            <Typography className={classes.welcomeToInfinote} variant="h2" color="primary">Welcome to Infinote</Typography>
            <Container maxWidth="md">
                <Typography align="center" className={classes.textField} variant="h5" gutterBottom>Infinote combines the benefits of journaling with the ease of using your own voice, yielding a truly unique note-taking experience.</Typography>
            </Container>
            <Button className={classes.getStartedButton} size="large" variant="contained" component="label" onClick={() => history.push("/alpha-sign-up")} color="primary">Get Started</Button>
            <Container>
                <Paper className={classes.paper}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6} lg={6}>
                        <Typography variant="h3" gutterBottom>Your notes. Your words. All in one place</Typography>
                        <Typography variant="h5" gutterBottom>Cloud storage automatically stores and backs up your uploaded entry files.</Typography>
                    </Grid>
                    <Grid item xs={12} md={1} lg={1}>
                        
                    </Grid>
                    
                    <Grid item xs={12} md={5} lg={5}>
                        <img src={infinoteLogo} width="200" height="200"></img>
                    </Grid>
                </Grid>
                </Paper>
            </Container>

            <Typography className={classes.welcomeToInfinote} variant="h3" gutterBottom>Features planned for Beta:</Typography>
            <Container maxWidth="sm">
                <Typography align="left" variant="h5" gutterBottom>1. Automatic speech to text transcription</Typography>
                <Typography align="left" variant="h5" gutterBottom>2. Log in with Google</Typography>
                <Typography align="left" variant="h5" gutterBottom>3. Record notes directly into the browser</Typography>
                <Typography align="left"variant="h5" gutterBottom>4. Search bar</Typography>
                <Typography align="left" variant="h5" gutterBottom>5. Tags for better organization</Typography>
            </Container>
        </Grid>

      </div>
    )
  }