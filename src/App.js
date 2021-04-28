import React, { useState, useEffect, useCallback } from "react"
import {ThemeContext} from "./ThemeContext"
import "./App.css"
import Game from "./Game"
import StartScreen from "./StartScreen"
import Navigation from "./Navigation"

function App(props){
    const[playerScore, setPlayerScore] = useState(0);
    const[playingGame, SetPlayingGame] = useState(false);
    let scoreAddedPerMatch = 100;

    // TODO: Try API call to get theme, if fail, revert to default
    const themes = {
        Theme1: { // Aqua + DarkOrange
            name: "default",
            backgroundMain: "#00ffff",
            backgroundSub: "#ff8c00",
            window: "#ff8c00",
            text: "#ffffff",
            cardSource: "./cards/default/"
        },
        Theme2: { // Miami Vice
            name: "vice",
            backgroundMain: "#0bd3d3",
            backgroundSub: "#f890e7",
            window: "#d0d0d0",
            text: "#ffffff",
            cardSource: "./cards/vice/"
        }
    };

    const [activeTheme, setActiveTheme] = useState(themes.Theme1);

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

    function toggleTheme(){
        setActiveTheme(prevState => {
            let newState = prevState.name === "default" ? themes.Theme2 : themes.Theme1;
            return newState;
        });
    }
    
    if(playingGame === false)
    {
        return(
            <>
                <ThemeContext.Provider value = {activeTheme}>
                    <StartScreen changeStartGame = {togglePlayingCallback}/>
                </ThemeContext.Provider>
            </>
        );
    }
    else
    {
        return (
            <>
                <ThemeContext.Provider value = {activeTheme}>
                    <div className="App">
                        <Navigation toggleThemeCallback={toggleTheme}/>
                        <Game score={playerScore} callbackScore = {scoreCallback} lostGame = {togglePlayingCallback}/>
                    </div>
                </ThemeContext.Provider>
            </>
        )
    }
}

export default App