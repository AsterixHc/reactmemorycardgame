import React from "react"

export const themes = {
    Theme1: {
        foreground: "./Cars/AS.png",
        background: "./Cars/B.png"
    },
    Theme2: {
        foreground: "#398dad",
        background: "#84CEEB"
    }
};

export const ThemeContext = React.createContext(themes.Theme1);