import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, authFetch } from './auth';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles({
    textField: {
      marginTop: 20,
      marginBottom: 20,
      align: "center",
      display: "block"
    },
    deleteAccountHeader: {
    marginTop: 40,
      marginBottom: 5,
      align: "center",
      display: "block"
    },
    everything: {
        marginTop: 40,
    },
    textSeparation: {
        marginTop: 10,
        marginBottom: 10
    }
  })

export default function Settings({ username }) {
    const classes = useStyles();
    const history = useHistory();
    const [logged] = useAuth();
    const [email, setEmail] = useState("");
    const [firstname, setFirstName] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleteText, setDeleteText] = useState("");
    const [buttonConfirm, setButtonConfirm] = useState(false);


    useEffect(() => {
        if(!logged) {
            history.push("/login");
        }
    }, [])

    useEffect(() => {
        authFetch(`/api/get-user-email/${username}`).then(r => r.json()).then(r => {setEmail(r.email); setFirstName(r.firstname); setLoading(false)})
        .catch(error => console.log(error));

    }, [])

    function onPasswordButton(e) {
        e.preventDefault();
        if(password1 !== "" && password2 !== ""){
            if(password1 == password2){
                const opts = {
                    "password": password1
                }
                authFetch(`/api/change-password/${username}`, {
                    method: "POST",
                    body: JSON.stringify(opts)
                }).then(r => r.json()).then(r => console.log(r)).catch(error => console.log(error));
            }
            else {
                console.log("Passwords do not match")
            }
        }
        else {
            console.log("Passwords cannot be blank")
        }
        
    }

    function onDeleteTextButton1(e) {
        if(deleteText == username) {
           setButtonConfirm(true);
        }
    }

    function onDeleteTextButton2(e) {
        authFetch(`/api/delete-user/${username}`, {
            method: "POST"
        }).then(r => r.json()).then(r => {console.log(r); setButtonConfirm(false);})
    }

    function onDeleteTextChange(e) {
        e.preventDefault();
        setDeleteText(e.target.value);
        if(deleteText !== username){
            setButtonConfirm(false);
        }
    }   


    return (
      <div className={classes.everything}>
        <Grid container direction="column" alignItems="center" justifyContent="center">
            <Typography variant="h2" className={classes.textSeparation}>Settings</Typography>
            <div>
                {loading ? <Typography variant="subtitle2">Loading Settings...</Typography>: 
                <div>
                    <Typography variant="h5" className={classes.textSeparation}>First Name: {firstname}</Typography>
                    <Typography variant="h5" className={classes.textSeparation}>Email: {email}</Typography>
                </div>
                }
            </div>
            <div>
                <Typography className={classes.textField} variant="h4">Change password</Typography>
                <Container>
                <Grid container spacing={4}>
                <Grid item xs={12} md={4} lg={4}>
                    <TextField 
                        className={classes.textField}
                        label="New Password"
                        variant="outlined"
                        color="secondary"
                        type="password"
                        required
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <TextField 
                        className={classes.textField}
                        label="Confirm Password"
                        variant="outlined"
                        color="secondary"
                        type="password"
                        required
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        /> 
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <br />
                    <Button 
                    variant="contained"
                    component="label"
                    size="large"
                    onClick={onPasswordButton}>
                        Change Password</Button>
                </Grid>
                </Grid>
                </Container>
            </div>
            <div>
            <Container>
                <Grid container spacing={8}>
                    <Grid item xs={12} md={6} lg={6}>
                        <Typography className={classes.deleteAccountHeader} variant="h4">Delete Account</Typography>
                        <Typography variant="subtitle2" color='textSecondary'>Warning: cannot be undone</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Typography className={classes.deleteAccountHeader} variant="subtitle1">Type in your username to delete</Typography>
                        <TextField
                        label={username}
                        variant="outlined"
                        color="secondary"
                        type="text"
                        value={deleteText}
                        onChange={onDeleteTextChange}
                        /> 
                        {buttonConfirm ? 
                        <Button
                        onClick={onDeleteTextButton2}
                        variant="contained"
                        component="label"
                        >
                        Confirm Delete
                        </Button>
                        :
                        <Button
                        onClick={onDeleteTextButton1}
                        variant="contained"
                        component="label"
                        >
                        Delete
                        </Button>}
                    </Grid>
                </Grid>
            </Container>
            </div>
        </Grid>
      </div>
    )
  }