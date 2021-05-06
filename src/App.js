import React, { useState, useEffect, useCallback, useMemo } from "react"
import { ThemeContext } from "./ThemeContext"
import "./App.css"
import Game from "./Game"
import Score from './Score'
import StartScreen from "./StartScreen"
import Navigation from "./Navigation"

function App(props) {
    // TODO: Try API call to get theme, if fail, revert to default
    const themes = useMemo(() => {
        return (
            {
                default: {
                    name: "default",
                    backgroundMain: "#00ffff",
                    backgroundSub: "#ff8c00",
                    window: "#ff8c00",
                    text: "#000000",
                    textShadow: "none",
                    cardSource: "./cards/default/"
                },
                vice: {
                    name: "vice",
                    backgroundMain: "#0bd3d3",
                    backgroundSub: "#f890e7",
                    window: "#d0d0d0",
                    text: "#ffffff",
                    textShadow: "0px 0px 4px rgba(0, 0, 0, 0.8)",
                    cardSource: "./cards/vice/"
                }
            }
        );
    }, []);

    const [activeTheme, setActiveTheme] = useState(themes.default);
    const [activeScreen, setActiveScreen] = useState("start");
    const [numberCards, setNumberCards] = useState(2);
    const [endGameStats, setEndGameStats] = useState({score: 0, lives: 0, timeRemaining: 0});

    useEffect(() => {
        document.body.style.backgroundColor = activeTheme.backgroundMain;
    }, [activeTheme]);

    const setNumberCardsCallback = useCallback(numberCards => {
        setNumberCards(numberCards);
    }, []);

    const selectThemeCallback = useCallback(themeName => {
        setActiveTheme(prevState => {
            if (prevState.name === themeName) return;

            let newState;

            switch (themeName) {
                case "default":
                    newState = themes.default;
                    break;

                case "vice":
                    newState = themes.vice;
                    break;

                // TODO: More here.

                default:
                    newState = themes.default;
                    break;
            }

            return newState;
        });
    }, [themes]);

    return (
        <div id="App" style={{ color: activeTheme.text, textShadow: activeTheme.textShadow }}>
            <ThemeContext.Provider value={activeTheme}>
                <Navigation selectThemeCallback={selectThemeCallback} setActiveScreen={setActiveScreen} />
                {activeScreen === "start" && <StartScreen setActiveScreen={setActiveScreen} setNumberCardsCallback={setNumberCardsCallback} />}
                {activeScreen === "single" && <Game setActiveScreen={setActiveScreen} numberCards={numberCards} setEndGameStats={setEndGameStats}/>}
                {activeScreen === "multi" && <Game setActiveScreen={setActiveScreen} numberCards={numberCards}/>}
                {activeScreen === "score" && <Score score={endGameStats.score} lives={endGameStats.lives} timeRemaining={endGameStats.timeRemaining}/>}
            </ThemeContext.Provider>
        </div>
    )
}

export default App