import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { authFetch } from './auth';

export default function ViewEntry({username}) {
    const { entry_id } = useParams();
    const [audioURL, setAudioURL] = useState(null);

    useEffect(() => {
        authFetch(`/get-entry-file/${username}/${entry_id}`)
        .then((r) => r.json()).then(r => {
            console.log(r);
            const data  = r.test;
            const raw = decodeURIComponent(data);
            const binaryData = new Uint8Array(new ArrayBuffer(raw.length));
            for (let i = 0; i < raw.length; i++) {
                binaryData[i] = raw.charCodeAt(i);
            }
            const blob = new Blob([binaryData], {'type': 'audio/mp3; codecs=opus'});
            setAudioURL(window.URL.createObjectURL(blob));

        })
    
    }, [])

    return (
        <div>
            <audio controls={true} type="audio.mp3" src={audioURL}></audio>
        </div>
    )
}