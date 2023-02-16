import React from 'react';

export function LoadingScreen(props) {
    return props.hasError
        ? <div>
            An error occured
            <p>{props.hasError}</p>
        </div>
        : <div>
            Loading data
        </div>;
}
