import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

//Top navigation part
function Navigation(props) {
    const theme = useContext(ThemeContext)
    const [themeSelect, setThemeSelect] = useState("default");

    //Handles the theme selection
    function handleThemeSelectChange(event) {
        setThemeSelect(event.target.value);
        console.log("setting theme with value: " + event.target.value);
        props.selectThemeCallback(event.target.value);
    }

    //Normal stuff for navigational bar, remember to insert something in Item 1 if needed
    return(
        <>
            <nav className="navigation" style={{backgroundColor: theme.window}}> 
                <ul>
                    <li><span>Item 1</span></li>
                    <li><span>Item 2</span></li>
                    <li><span>Item 3</span></li>
                    <li>
                        <label>Select a theme:</label>
                        <select id="theme-select-input" value={themeSelect} onChange={handleThemeSelectChange}>
                            <option value="default">Default</option>
                            <option value="vice">Miami Vice</option>
                        </select>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Navigation;