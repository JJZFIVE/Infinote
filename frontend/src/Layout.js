import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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

export default function Layout({ children, username, logged }) {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
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
        }
    ];

    return (
        <div className={classes.root}>
            <AppBar
            className={classes.appbar}
            position="fixed">
                <Toolbar>
                    <Typography variant="h6" className={classes.test} >Welcome, {username}</Typography>
                    {logged ? 
                    <Button size="large" color="inherit" onClick={() => history.push("/")}>Log Out</Button> 
                    : 
                    <Button size="large" color="inherit" onClick={() => history.push("/")}>Login</Button>}
                </Toolbar>
            </AppBar>

            <Drawer 
            className={classes.drawer}
            variant="permanent"
            anchor="left"
            classes={{ paper: classes.drawerPaper }}
            >
                <div>
                    <Typography variant="h5">
                        Infinote
                    </Typography>
                </div>
                <List>
                    {menuItems.map(item => (
                        <ListItem 
                        key={item.text}
                        button
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