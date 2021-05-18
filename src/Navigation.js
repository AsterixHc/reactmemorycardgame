import React, { useState, useContext, useCallback } from 'react';
import { ThemeContext } from './ThemeContext';
import './stylesheets/navigation.css'

// Top navigation menu.
function Navigation(props) {
    const theme = useContext(ThemeContext)
    const [themeSelect, setThemeSelect] = useState("default");

    // Handles theme selection.
    const handleThemeSelectChange = useCallback(event => {
        setThemeSelect(event.target.value);
        props.selectThemeCallback(event.target.value);
    }, [props]);

    return (
        <>
            <nav className="nav" style={{ backgroundColor: theme.menuColor }}>
                <ul>
                    <li onClick={() => props.setActiveScreen("start")}>
                        Home
                    </li>
                    <li className="theme-select">
                        <label>Select a theme: </label>
                        <select value={themeSelect} onChange={handleThemeSelectChange}>
                            <option value="default">Default</option>
                            <option value="vice">Miami Vice</option>
                            {props.themes.online
                                ? <option value="online">Pixel</option>
                                : <option disabled={true} style={{ fontStyle: "italic" }}>Unavailable</option>
                            }
                        </select>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Navigation;