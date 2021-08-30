import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
  } from "react-router-dom";
import { authFetch } from './auth';

function Upload(props) {
  const [myFile, setMyFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [tags, setTags] = useState("");
  const [entries, setEntries] = useState([]);

  function onFileChange(e) {
    e.preventDefault();
    setMyFile(e.target.files[0]);
    document.getElementById("warning-text").innerHTML = "";
  }

  function onFilenameChange(e) {
    e.preventDefault();
    setFilename(e.target.value);
    document.getElementById("warning-text").innerHTML = "";
  }

  function onTagsChange(e) {
    setTags(e.target.value);
    document.getElementById("warning-text").innerHTML = "";
  }

  function onFileUpload() {
    const fd = new FormData();
    fd.append("username", props.username);
    fd.append("filename", filename);
    fd.append("tags", tags);
    fd.append("file", myFile);
    for (let pair of fd) {
      console.log(pair[0] + ", " + pair[1]);
    }
    if (props.username !== '' && filename !== '' && myFile !== null){
      authFetch("/api/upload-entry", {
        method: "POST",
        body: fd
      }).then(r => r.json()).then(r => console.log(r)).catch(error => console.log(error))
    }
    else {
      document.getElementById("warning-text").innerHTML = "Please upload valid fields";
    }
  }

  return (
    <div>
          <input type="file" onChange={onFileChange} />
          <label htmlFor="filename">Entry Name: </label>
          <input id="filename" type="text" onChange={onFilenameChange} />
          <label htmlFor="tags">(optional) Tags: </label>
          <input id="tags" type="text" onChange={onTagsChange} />
          <button onClick={onFileUpload}>
              Upload!
          </button>
      <div>
        <h3 id="warning-text"></h3>
      </div>
    </div>

  );
}

export default Upload;