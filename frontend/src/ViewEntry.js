import React, {useEffect, useState} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { authFetch, useAuth } from './auth';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function ViewEntry({username}) {
    const { entry_id } = useParams();
    const history = useHistory();
    const [logged] = useAuth();
    const [audioURL, setAudioURL] = useState(null);

    useEffect(() => {
        if(!logged) {
            history.push("/login");
        }
    }, []);

    useEffect(() => {
        authFetch(`/get-entry-file/${username}/${entry_id}`)
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

        })
    
    }, [])

    return (

        <div>
            {/* <audio controls={true} type="audio" src={audioURL}></audio>*/}
            <AudioPlayer
            src={audioURL}
            onPlay={e => console.log("onPlay")}
            // other props here
            />
        </div>
    )
}