import React, { useContext, useEffect } from 'react';
import './stylesheets/timedpopup.css'
import { ThemeContext } from './ThemeContext';

function TimedPopup(props) {
    const { trigger, setTrigger, duration } = props;
    const theme = useContext(ThemeContext);

    useEffect(() => {
        if (!trigger) return;

        let timeout = setTimeout(() => {
            setTrigger(false);
        }, duration);

        return () => clearTimeout(timeout);
    }, [trigger, setTrigger, duration]);

    return (
        <div className={"timed-popup" + (trigger ? "" : " hide")}>
            <div className="children" style={{ backgroundColor: theme.backgroundBoxColor }}>
                {props.children}
            </div>
        </div>
    );

}

export default TimedPopup;