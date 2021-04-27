import React from "react"
import {ThemeContext} from "./ThemeContext"
import "./App.css"
import Game from "./Game"

function App(props){
    // TODO: Try API call to get theme, if fail, revert to default
    const themes = {
        Theme1: { // Aqua + DarkOrange
            cardback: "./cards/B.png",
            backgroundMain: "#00ffff",
            backgroundSub: "#ff8c00",
            window: "#00ffff",
            text: "#ff8c00"
        },
        Theme2: { // Miami Vice
            cardback: "./cards/B.png",
            backgroundMain: "#0bd3d3",
            backgroundSub: "#f890e7",
            window: "#d0d0d0",
            text: "#ffffff"
        }
    };

    const theme = themes.Theme1; // <- Change themes here.

    return (
        <>
            <ThemeContext.Provider value = {theme}>
                <div className="App" style={{backgroundColor: theme.backgroundMain}}>
                    <Game />
                </div>
            </ThemeContext.Provider>
        </>
    )
}

export default App