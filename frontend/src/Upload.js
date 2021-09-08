import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { authFetch, useAuth } from './auth';
// Material UI Component imports
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  textField: {
    marginTop: 20,
    marginBottom: 20,
    align: "center",
    display: "block"
  },
})



function Upload(props) {

  const classes = useStyles();
  const [logged] = useAuth();
  const history = useHistory();
  const [myFile, setMyFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [tags, setTags] = useState("");
  const [fileError, setFileError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    if(!logged) {
      history.push("/login");
    }
  }, [])

  function onFileChange(e) {
    e.preventDefault();
    setMyFile(e.target.files[0]);
    document.getElementById("warning-text").innerHTML = "";
    setFileError(false);
    setFileUploaded(false);
  }

  function onFilenameChange(e) {
    e.preventDefault();
    setFilename(e.target.value);
    document.getElementById("warning-text").innerHTML = "";
    setNameError(false);
    setFileUploaded(false);
  }

  function onTagsChange(e) {
    setTags(e.target.value);
    document.getElementById("warning-text").innerHTML = "";
    setFileUploaded(false);
  }

  function deleteFile() {
    setMyFile(null);
  }

  function onFileUpload() {
      const reader = new FileReader();
      if (myFile){
        reader.readAsDataURL(myFile);
        reader.onload = function () {
          console.log(reader.result);
          let text = reader.result;
          if (props.username !== '' && filename !== '' && myFile !== null){
            authFetch(`/api/upload-entry/${props.username}/${filename}`, {
              method: "POST",
              body: JSON.stringify({"file": text})
            }).then(r => r.json()).then(r => console.log(r)).catch(error => console.log(error));
            setMyFile(null);
            setFilename("");
            setTags("");
            setFileUploaded(true);
          }
          else {
            document.getElementById("warning-text").innerHTML = "Please upload valid fields";
            if(filename == ""){
              setNameError(true);
            }
            if(myFile == null) {
              setFileError(true);
            }
          }
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
        
      }
      else {
        document.getElementById("warning-text").innerHTML = "Please upload valid fields";
        if(myFile == null) {
          setFileError(true);
        }
      }  
  }

  return (
    <div>
          {myFile == null ? 
          <div>
            {fileError ? 
            <Typography variant="subtitle1" color="error">* Must Select a File *</Typography>
            : <div />}
            <Button
            variant="contained"
            component="label"
            startIcon={<AddIcon />}>
            Select File
            <input type="file" onChange={onFileChange} hidden /> 
          </Button>
          </div>
          :
          <div>
          <Button onClick={deleteFile}><ClearIcon color="error"/></Button>
          <Button
            variant="contained"
            component="label"
            color="primary"
            // Use classes to change this color to an OK green
            startIcon={<DoneIcon />}>
            File Selected
            <input type="file" onChange={onFileChange} hidden /> 
          </Button>
          </div>
          }
          
          {/*<label htmlFor="filename">Entry Name: </label>
          <input id="filename" type="text" onChange={onFilenameChange} />
          <label htmlFor="tags">(optional) Tags: </label>
          <input id="tags" type="text" onChange={} />*/}

          <form noValidate autoComplete="off">
            <TextField 
              className={classes.textField}
              label="Entry Name"
              variant="outlined"
              color="secondary"
              required
              value={filename}
              onChange={onFilenameChange}
              error={nameError}
            />
            <TextField 
              className={classes.textField}
              label="Tags (optional)"
              variant="outlined"
              color="secondary"
              value={tags}
              onChange={onTagsChange}
            />
          </form>

          <Button onClick={onFileUpload} startIcon={<CloudUploadIcon />} variant="contained" color="primary">Upload</Button>
      <div>
        <h3 id="warning-text"></h3>
        {fileUploaded ? <Typography variant="h5" color="primary">File Successfully Uploaded!</Typography> : <div />}
      </div>
    </div>

  );
}

export default Upload;