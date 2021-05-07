import React from 'react';

// Logic for timer.
function Timer(props) {
    let minutes = Math.floor(props.timeRemaining / 60).toString().padStart(2, '0'); // Takes seconds and makes it into minutes.
    let seconds = Math.floor(props.timeRemaining % 60).toString().padStart(2, '0');

    return (
        <>
            Timer: {minutes + " : " + seconds}
        </>
    );
}

export default Timer;