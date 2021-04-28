import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Navigation(props) {
    const theme = useContext(ThemeContext)

    return(
        <>
            <nav className="navigation" style={{backgroundColor: theme.window}}>
                <ul>
                    <li><span>Item 1</span></li>
                    <li><span>Item 2</span></li>
                    <li><span>Item 3</span></li>
                    <li><button onClick={() => props.toggleThemeCallback()}>Change Theme</button></li>
                </ul>
            </nav>
        </>
    );
}

export default Navigation;