import React, { useState } from "react"
import {ThemeContext} from "./ThemeContext"
import "./App.css"
import Game from "./Game"
import StartScreen from "./StartScreen"

function App(props){
    const[playerScore, setPlayerScore] = useState(0);
    const[playingGame, SetPlayingGame] = useState(false);
    let scoreAddedPerMatch = 100;

    // TODO: Try API call to get theme, if fail, revert to default
    const themes = {
        Theme1: { // Aqua + DarkOrange
            backgroundMain: "#00ffff",
            backgroundSub: "#ff8c00",
            window: "#00ffff",
            text: "#ff8c00",
            cardSource: "./cards/default/"
        },
        Theme2: { // Miami Vice
            backgroundMain: "#0bd3d3",
            backgroundSub: "#f890e7",
            window: "#d0d0d0",
            text: "#ffffff",
            cardSource: "./cards/vice/"
        }
    };

    const theme = themes.Theme2; // <- Change themes here.

    function ScoreChange()
    {
        setPlayerScore(prevState => {
            let newState = prevState + scoreAddedPerMatch;
            return newState;
        });
    }
    
//TODO: Start Screen
    if(playingGame === false)
    {
        return(
            <>
                <StartScreen changeStartGame = {SetPlayingGame}/>
            </>
        );
    }
    else
    {
        return (
            <>
                <ThemeContext.Provider value = {theme}>
                    <div className="App" style={{backgroundColor: theme.backgroundMain}}>
                        <Game score={playerScore} callbackScore = {ScoreChange} lostGame = {SetPlayingGame}/>
                    </div>
                </ThemeContext.Provider>
            </>
        )
    }
}

export default App