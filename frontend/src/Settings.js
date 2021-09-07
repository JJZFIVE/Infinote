import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, authFetch } from './auth';

export default function Settings({ username }) {
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
        authFetch(`/get-user-email/${username}`).then(r => r.json()).then(r => {setEmail(r.email); setFirstName(r.firstname); setLoading(false)})
        .catch(error => console.log(error));

    }, [])

    function onPasswordButton(e) {
        e.preventDefault();
        if(password1 !== "" && password2 !== ""){
            if(password1 == password2){
                const opts = {
                    "password": password1
                }
                authFetch(`/change-password/${username}`, {
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
        setDeleteText(e.target.value);
        if(deleteText !== username){
            setButtonConfirm(false);
        }
    }   


    return (
      <div>
        <h1>Settings</h1>
        <div>
            {loading ? <h3>Loading Settings...</h3> : 
            <div>
                <h3>First Name: {firstname}</h3>
                <h3>Email: {email}</h3>
            </div>
            }
        </div>
        <div>
            <h3>Change password</h3>
            <input type="password" type="text" placeholder="New Password" onChange={(e) => setPassword1(e.target.value)}></input>
            <input type="password" type="text" placeholder="Confirm New Password" onChange={(e) => setPassword2(e.target.value)}></input>
            <button onClick={onPasswordButton}>Change Password</button>
        </div>
        <div>
            <h3>Delete Account</h3>
            <h4>Type in your username</h4>
            <input type="text" placeholder={username} onChange={onDeleteTextChange}></input>
            {buttonConfirm ? <button onClick={onDeleteTextButton2}>Confirm Delete</button> : <button onClick={onDeleteTextButton1}>Delete</button>}
        </div>
      </div>
    )
  }