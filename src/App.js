import React, { useState, useEffect, useCallback } from "react"
import {ThemeContext} from "./ThemeContext"
import "./App.css"
import Game from "./Game"
import StartScreen from "./StartScreen"
import Navigation from "./Navigation"

function App(props){
    // TODO: Try API call to get theme, if fail, revert to default
    const themes = {
        default: {
            name: "default",
            backgroundMain: "#00ffff",
            backgroundSub: "#ff8c00",
            window: "#ff8c00",
            text: "#ffffff",
            cardSource: "./cards/default/"
        },
        vice: {
            name: "vice",
            backgroundMain: "#0bd3d3",
            backgroundSub: "#f890e7",
            window: "#d0d0d0",
            text: "#ffffff",
            cardSource: "./cards/vice/"
        }
    };
    
    const [activeTheme, setActiveTheme] = useState(themes.default);
    const [playerScore, setPlayerScore] = useState(0);
    const [playingGame, SetPlayingGame] = useState(false);
    let scoreAddedPerMatch = 100;

    useEffect(() => {
        document.body.style.backgroundColor = activeTheme.backgroundMain;
    },[activeTheme]);

    const scoreCallback = useCallback(() => {
        setPlayerScore(prevState => {
            let newState = prevState + scoreAddedPerMatch;
            return newState;
        });
    }, [scoreAddedPerMatch]);

    const togglePlayingCallback = useCallback(() => {
        SetPlayingGame( prevState => {
            return !prevState;
        });
    },[]);

    const selectThemeCallback = useCallback(themeName => {
        if (activeTheme.name === themeName) return;

        setActiveTheme(() => {
            let newTheme;

            switch (themeName) {
                case "default":
                    newTheme = themes.default;
                    break;
                case "vice":
                    newTheme = themes.vice;
                    break;
                // TODO: More cases when additional themes are added...
                default:
                    newTheme = themes.default;
                    break;
            }
            return newTheme;
        });
        // eslint-disable-next-line
    },[activeTheme]);

    return (
        <>
            <ThemeContext.Provider value = {activeTheme}>
                <div className="App">
                    <Navigation selectThemeCallback={selectThemeCallback}/>
                    {playingGame
                        ? <Game score={playerScore} callbackScore = {scoreCallback} lostGame = {togglePlayingCallback}/>
                        : <StartScreen changeStartGame = {togglePlayingCallback}/>
                    }
                </div>
            </ThemeContext.Provider>
        </>
    )
}

export default App