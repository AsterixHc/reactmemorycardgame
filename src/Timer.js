import React from "react"

function Timer(Props) {
    return(
        <>
            <div>
                <h1>Time: {Props.timer}</h1>
            </div>
        </>
    );
}

export default Timer;