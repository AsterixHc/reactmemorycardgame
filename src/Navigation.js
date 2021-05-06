import React, { useState, useContext, useCallback } from 'react';
import { ThemeContext } from './ThemeContext';

//Top navigation part
function Navigation(props) {
    const theme = useContext(ThemeContext)
    const [themeSelect, setThemeSelect] = useState("default");

    //Handles the theme selection
    const handleThemeSelectChange = useCallback(event => {
        setThemeSelect(event.target.value);
        props.selectThemeCallback(event.target.value);
    }, [props]);

    return (
        <>
            <nav id="nav" style={{ backgroundColor: theme.window }}>
                <ul>
                    <li onClick={() => { props.setActiveScreen("start") }}>
                        Home
                </li>
                    {/* <li>Item 2</li>
                    <li>Item 3</li> */}
                    <li id="theme-select">
                        <label>Select a theme: </label>
                        <select value={themeSelect} onChange={handleThemeSelectChange}>
                            <option value="default">Default</option>
                            <option value="vice">Miami Vice</option>
                        </select>
                    </li>
                </ul>
            </nav>
            {/* <div id="navigation-spacer">&nbsp;</div> */}
        </>
    );
}

export default Navigation;