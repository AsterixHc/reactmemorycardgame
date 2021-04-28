import React from 'react';
import Score from './Score';
import Lives from './Lives';

function Sidebar(props) {
    return(
        <>
            <div className="sidebar">
                <Score score={props.score}/>
                <Lives lives= {props.lives}/>
            </div>
        </>
    );
}

export default Sidebar;