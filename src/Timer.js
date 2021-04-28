import React from 'react'
import Countdown from 'react-countdown';

function Timer(Props){
    return(
        <div>
            <h1>
                Timer: <Countdown date = { Date.now() + 5000*60} />
            </h1>
        </div>
        //PROBLEM!! Chosen card resets timer, should add some previouse state
    );
}

export default Timer;