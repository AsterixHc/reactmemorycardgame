import React, { useState, useEffect, useCallback, useMemo } from "react"
import { ThemeContext } from "./ThemeContext"
import "./App.css"
import SingleGame from "./SingleGame"
import MultiGame from "./MultiGame"
import ScoreScreen from './ScoreScreen'
import StartScreen from "./StartScreen"
import Navigation from "./Navigation"
import useOnlineTheme from "./useOnlineTheme"

function App(props) {
    // TODO: Try API call to get theme, if fail, revert to default (In progress...)
    // Token used for accessing themes API.
    // const onlineTheme = useOnlineTheme(); // <-- Commented out until Jan can help.

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
    const [gameStats, setGameStats] = useState({ score: 0, lives: 0, timer: 0 });

    useEffect(() => {
        document.body.style.backgroundColor = activeTheme.backgroundMain;
    }, [activeTheme]);

    const onGameEndCallback = useCallback((score, lives, timer) => {
        setGameStats({ score, lives, timer });
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
                {activeScreen === "start" && <StartScreen setActiveScreen={setActiveScreen} setNumberCards={setNumberCards} />}
                {activeScreen === "single" && <SingleGame setActiveScreen={setActiveScreen} onGameEnd={onGameEndCallback} numberCards={numberCards} />}
                {activeScreen === "multi" && <MultiGame setActiveScreen={setActiveScreen} onGameEnd={onGameEndCallback} numberCards={numberCards} />}
                {activeScreen === "score" && <ScoreScreen score={gameStats.score} lives={gameStats.lives} timeRemaining={gameStats.timer} />}
            </ThemeContext.Provider>
        </div>
    )
}

export default App