import React, { useContext } from 'react';
import Timer from './Timer';
import { ThemeContext } from './ThemeContext';

// Holds everything that shows in game's sidebar.
function Sidebar(props) {
    const theme = useContext(ThemeContext);

    return (
        <div id="sidebar" style={{ backgroundColor: theme.window }}>
            <h2>Points: {props.score}</h2>
            <h2>Lives: {props.lives}</h2>
            <h2><Timer timeRemaining={props.timeRemaining} /></h2>
        </div>

        // <nav className="sidebar" style={{ backgroundColor: theme.window }}>
        //     <span><h1>Points: {props.score}</h1></span>
        //     <span><h1>Lives: {props.lives}</h1></span>
        //     <span><Timer timeRemaining={props.timeRemaining} /></span>
        // </nav>
    );
}

export default Sidebar;