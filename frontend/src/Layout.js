import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { authFetch, logout } from './auth';
import { useHistory, useLocation, Link } from 'react-router-dom';
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { AddCircleOutlineOutlined, SubjectOutlined } from "@material-ui/icons";
import SettingsIcon from '@material-ui/icons/Settings';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AssignmentIcon from '@material-ui/icons/Assignment';
import infinoteBanner from './assets/InfinoteBanner.jpg';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => {
    return {
    page: {
        background: "#f9f9f9", 
        width: "100%"
    },
    drawer: {
        width: drawerWidth,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    root: {
        display: "flex",
    },
    active: {
        background: "#f4f4f4"
    },
    appbar: {
        width: `calc(100% - ${drawerWidth}px)`
    },
    toolbar: theme.mixins.toolbar,
    test: {
        flexGrow: 1,
      },
}});

export default function Layout({ children, username, logged, usernameFunc }) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const [firstname, setFirstname] = useState("");
    const menuItems = [
        {
            text: "My Entries",
            icon: <SubjectOutlined color="secondary"/>,
            path: "/entries"
        },
        {
            text: "Upload Entry",
            icon: <AddCircleOutlineOutlined color="secondary"/>,
            path: "/upload"
        },
        {
            text: "Settings",
            icon: <SettingsIcon color="secondary"/>,
            path: "/settings"
        },
        {
            text: "Feedback",
            icon: <AssignmentIcon color="secondary"/>,
            path: "/feedback"
        }
    ];

    useEffect(() => {
        authFetch(`/api/get-firstname/${username}`)
        .then(r => r.json()).then(r => setFirstname(r.firstname)).catch(error => console.log(error));
    }, [username]);

    // LOG OUT FUNCTION
    function logMeOut() {
        history.push("/");
        logout();
        usernameFunc("");
        localStorage.clear();
    }

    return (
        <div className={classes.root}>
            <AppBar
            className={classes.appbar}
            position="fixed">
                <Toolbar>
                    {logged ? <Typography variant="h6" className={classes.test} >Welcome, {firstname}</Typography> 
                    : <Typography variant="h6" className={classes.test} >Infinote Alpha 1.0</Typography>}
                    
                    {logged ? 
                    <Button size="large" color="inherit" onClick={logMeOut}>Log Out</Button> 
                    : 
                    <Button size="large" color="inherit" onClick={() => history.push("/login")}>Login</Button>}
                </Toolbar>
            </AppBar>
            
            <Drawer 
            className={classes.drawer}
            variant="permanent"
            anchor="left"
            classes={{ paper: classes.drawerPaper }}
            >
            <Link to="/">
                <img src={infinoteBanner} width="200" height="80"></img>
            </Link>       
                <List>
                    {menuItems.map(item => (
                        <ListItem 
                        key={item.text}
                        button
                        disabled = {!logged}
                        onClick={() => history.push(item.path)}
                        className={location.pathname == item.path ? classes.active : null}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <div className={classes.page}>
                <div className={classes.toolbar}></div>
                {children}
            </div>
            
        </div>
    )
}