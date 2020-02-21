import React from 'react';

function Loader(props: any) {

    console.log(props);
    const styles = {
        width: props.size || '100%',
        height: props.size || '100%',
        margin: 'auto'
    };

    return (
        <div style={ styles }>
            <svg xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink" style={ { margin: 'auto',display: 'block' } } viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                <circle cx="50" cy="50" r="32" strokeWidth="8" stroke="#3f51b5" strokeDasharray="50.26548245743669 50.26548245743669" fill="none" strokeLinecap="round" transform="rotate(38.2442 50 50)">
                <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
                </circle>
                <circle cx="50" cy="50" r="23" strokeWidth="8" stroke="#a7d4ec" strokeDasharray="36.12831551628262 36.12831551628262" strokeDashoffset="36.12831551628262" fill="none" strokeLinecap="round" transform="rotate(-38.2442 50 50)">
                <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;-360 50 50"></animateTransform>
                </circle>
            </svg>
        </div>
    )
}

export default Loader;