import React, {useEffect} from 'react';

export default function ViewEntry(props) {
    useEffect(() => {
        console.log(props.match);
    }, [])

    return (
        <div>
            <h3>{props}</h3>
        </div>
    )
}