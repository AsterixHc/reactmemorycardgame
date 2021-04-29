import React from 'react'

//Logich for timer
function Timer(props){
    let minutes = Math.floor(props.timeRemaining / 60).toString().padStart(2, '0'); //Takes secounds and makes it into mins
    let seconds = Math.floor(props.timeRemaining % 60).toString().padStart(2, '0'); 

    return(
            <h1>
                Timer: {minutes + " : " + seconds}
            </h1>
    );
}

export default Timer;