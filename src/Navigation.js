import React, { useState, useContext, useCallback } from 'react';
import { ThemeContext } from './ThemeContext';
import './stylesheets/navigation.css'

function Navigation(props) {
    const { selectThemeCallback, setActiveScreen, themes } = props;
    const theme = useContext(ThemeContext)
    const [themeSelect, setThemeSelect] = useState("default");

    const handleThemeSelectChange = useCallback(event => {
        setThemeSelect(event.target.value);
        selectThemeCallback(event.target.value);
    }, [selectThemeCallback]);

    return (
        <nav className="nav" style={{ backgroundColor: theme.menuColor }}>
            <ul>
                <li onClick={() => setActiveScreen("start")}>
                    Home
                    </li>
                <li className="theme-select">
                    <label>Select a theme: </label>
                    <select value={themeSelect} onChange={handleThemeSelectChange}>
                        <option value="default">Default</option>
                        <option value="vice">Miami Vice</option>
                        {themes.online
                            ? <option value="online">Pixel</option>
                            : <option disabled={true} style={{ fontStyle: "italic" }}>Unavailable</option>
                        }
                    </select>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;