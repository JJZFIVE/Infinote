import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
  } from "react-router-dom";
import { makeStyles, Typography } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { DeleteOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { authFetch } from './auth';

export default function EntryCard({ entry, deleteEntry }) {


    return (
        <div>
            {/* <DeleteEntry username={props.username} /> */}
            <Card elevation={1}>
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
            </Card>
        </div>
    )
}