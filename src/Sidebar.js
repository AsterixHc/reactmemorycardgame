import React, { useContext } from 'react';
import Timer from './Timer';
import { ThemeContext } from './ThemeContext';

// Holds everything that shows in game's sidebar.
function Sidebar(props) {
    const theme = useContext(ThemeContext);

    return (
        <nav className="sidebar" style={{ backgroundColor: theme.window }}>
            <span><h1>Points: {props.score}</h1></span>
            <span><h1>Lives: {props.lives}</h1></span>
            <span><Timer timeRemaining={props.timeRemaining} /></span>
        </nav>
    );
}

export default Sidebar;