import React from 'react';
import Score from './Score';
import Lives from './Lives';
import Timer from './Timer';

function Sidebar(props) {
    return(
        <>
            <div className="sidebar">
                <Score score={props.score}/>
                <Lives lives= {props.lives}/>
                <Timer timer = {props.timer}/>
            </div>
        </>
    );
}

export default Sidebar;