import React, { useContext } from "react"
import { ThemeContext } from "./ThemeContext";

function Score(props) {
    const theme = useContext(ThemeContext);

    let gameOverMessage;

    if (props.lives === 0) {
        gameOverMessage = "Game over: Ran out of lives!";
    }
    else if (props.timeRemaining <= 0) {
        gameOverMessage = "Game over: Ran out of time!";
    }
    else {
        gameOverMessage = "All cards cleared!";
    }

    return (
        <div className="score-component" style={{ backgroundColor: theme.backgroundSub }}>
            <h1>{gameOverMessage}</h1>
            <h2>Time remaining: {props.timeRemaining} seconds</h2>
            <h2>Lives remaining: {props.lives}</h2>
            <h2>Points for matching cards: {props.score}</h2>
            <hr></hr>
            <h2>Final score: {(props.lives + props.timeRemaining) * props.score}</h2>
        </div>
    );
}

export default Score;