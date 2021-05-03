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
            <ul className="navigation" style={{ backgroundColor: theme.window }}>
                <li>
                    <span onClick={() => { props.setPlayingGame(false) }}>Home</span>
                </li>
                {/* <li><span>Another item</span></li> */}
                {/* <li><span>Another item</span></li> */}
                <li id="theme-select-input">
                    <label>Select a theme: </label>
                    <select value={themeSelect} onChange={handleThemeSelectChange}>
                        <option value="default">Default</option>
                        <option value="vice">Miami Vice</option>
                    </select>
                </li>
            </ul>
            <div id="navigation-spacer">&nbsp;</div>
        </>
    );
}

export default Navigation;