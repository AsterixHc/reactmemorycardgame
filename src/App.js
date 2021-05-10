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
    // Theme object fethed from API.
    const onlineTheme = useOnlineTheme();

    // All available themes.
    const themes = useMemo(() => {
        return (
            {
                default: {
                    name: "default",
                    textColor: "#ffffff",
                    buttonColor: "#ff8c00",
                    backgroundColor: "#00ffff",
                    menuColor: "#ff8c00",
                    backgroundBoxColor: "#ff8c00",
                    buttonTextColor: "#ffffff",
                    textShadow: "none",
                    cardSource: "./cards/default/"
                },
                vice: {
                    name: "vice",
                    textColor: "#ffffff",
                    backgroundColor: "#d0d0d0",
                    backgroundBoxColor: "#0bd3d3",
                    buttonColor: "#f890e7",
                    buttonTextColor: "#ffffff",
                    menuColor: "#f890e7",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    cardSource: "./cards/vice/"
                },
                online: onlineTheme
            }
        );
    }, [onlineTheme]);

    // The theme that is currently active.
    const [activeTheme, setActiveTheme] = useState(themes.default);

    // The screen that is currently being rendered.
    const [activeScreen, setActiveScreen] = useState("start");

    // The number of cards being dealt when starting a game (variable from start screen).
    const [numberCards, setNumberCards] = useState(10);

    // Relevant stats from a finished game to be passed on to score screen.
    const [gameStats, setGameStats] = useState({ score: 0, lives: 0, timer: 0 });

    // Sets the background of entire app, using evil html.
    useEffect(() => {
        document.body.style.backgroundColor = activeTheme.backgroundColor;
    }, [activeTheme]);

    // Callback that sets the game stats when a game finishes.
    const onGameEndCallback = useCallback((score, lives, timer) => {
        setGameStats({ score, lives, timer });
    }, []);

    // Callback that sets the currently active theme.
    const selectThemeCallback = useCallback(themeName => {
        if (activeTheme.name === themeName) return;

        setActiveTheme(() => {
            let newState;

            switch (themeName) {
                case "default":
                    newState = themes.default;
                    break;

                case "vice":
                    newState = themes.vice;
                    break;

                case "online":
                    newState = themes.online;
                    break;

                default:
                    newState = themes.default;
                    break;
            }

            return newState;
        });
    }, [themes, activeTheme]);

    return (
        <div className="app" style={{ color: activeTheme.textColor, textShadow: activeTheme.textShadow }}>
            <ThemeContext.Provider value={activeTheme}>
                <Navigation selectThemeCallback={selectThemeCallback} setActiveScreen={setActiveScreen} themes={themes}/>
                {activeScreen === "start" && <StartScreen setActiveScreen={setActiveScreen} setNumberCards={setNumberCards} />}
                {activeScreen === "single" && <SingleGame setActiveScreen={setActiveScreen} onGameEnd={onGameEndCallback} numberCards={numberCards} />}
                {activeScreen === "multi" && <MultiGame setActiveScreen={setActiveScreen} onGameEnd={onGameEndCallback} numberCards={numberCards} />}
                {activeScreen === "score" && <ScoreScreen score={gameStats.score} lives={gameStats.lives} timeRemaining={gameStats.timer} />}
            </ThemeContext.Provider>
        </div>
    )
}

export default App