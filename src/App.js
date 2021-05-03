import React, { useState, useEffect, useCallback, useMemo } from "react"
import { ThemeContext } from "./ThemeContext"
import "./App.css"
import Game from "./Game"
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
    const [playingGame, setPlayingGame] = useState(false);
    const [numberCards, setNumberCards] = useState(2);

    useEffect(() => {
        document.body.style.backgroundColor = activeTheme.backgroundMain;
    }, [activeTheme]);

    const setPlayingCallback = useCallback(playing => {
        setPlayingGame(playing);
    }, []);

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
        <div className="App" style={{ color: activeTheme.text, textShadow: activeTheme.textShadow }}>
            <ThemeContext.Provider value={activeTheme}>
                <Navigation selectThemeCallback={selectThemeCallback} setPlayingGame={setPlayingCallback} />
                {playingGame
                    ? <Game numberCards={numberCards}/>
                    : <StartScreen setPlayingGame={setPlayingCallback} setNumberCardsCallback={setNumberCardsCallback} />
                }
            </ThemeContext.Provider>
        </div>
    )
}

export default App