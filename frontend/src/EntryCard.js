import React, { useState, useEffect  } from 'react';
import {
    BrowserRouter as Router,
    useHistory
  } from "react-router-dom";
import { makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { DeleteOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';

const useStyles = makeStyles((theme) => {
    return {
    cardAction: {
        display: 'block',
        textAlign: 'initial'
    }
}});

export default function EntryCard({ entry, deleteEntry }) {
    const history = useHistory();
    const classes = useStyles();
    const [entryInfo, setEntryInfo] = useState({});


    return (
        <div>
            {/* <DeleteEntry username={props.username} /> */}
            <Card elevation={1}>
                <ButtonBase className={classes.cardAction} onClick={() => history.push(`/entries/${entry.id}`)}>
                    <CardHeader 
                    action={
                        <IconButton onClick={() => deleteEntry(entry.id)}>
                        <DeleteOutlined />
                        </IconButton>
                    }
                    title={entry.name}
                    subheader={entry.registered_date}
                    />
                    {/* <CardContent>
                        <Typography variant="body2" color="textSecondary">
                        {entry.tags}
                        </Typography>
                    </CardContent>
                    // Would want to add preview + pulldown of transcribed text
                    // Need to add space for tags as well as a like button to like your favorites
                    */}
                </ButtonBase>
            </Card>
        </div>
    )
}