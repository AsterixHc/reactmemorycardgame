import React from "react"
import Countdown from 'react-countdown';

function Timer(Props) {
    return(
        //5000*60 = 5 mins || 1000*60 = 1 mins || 25000*60 = 25 mins || look up time math
        <div>
            Timer: <Countdown date={Date.now() + 5000*60} />  
        </div>
    );
}

export default Timer;