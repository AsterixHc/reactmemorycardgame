import React, { useContext } from 'react';
import Timer from './Timer';
import { ThemeContext } from './ThemeContext';

// Holds everything that shows in game's sidebar.
function Sidebar(props) {
    const theme = useContext(ThemeContext);

    return (
        <div className="sidebar" style={{ backgroundColor: theme.backgroundBoxColor }}>
            <h2>Points: {props.score}</h2>
            <h2>Lives: {props.lives}</h2>
            <h2><Timer timeRemaining={props.timeRemaining} /></h2>
        </div>
    );
}

export default Sidebar;