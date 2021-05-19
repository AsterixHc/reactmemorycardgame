import React, { useContext } from "react"
import { ThemeContext } from "./ThemeContext";
import './stylesheets/scorescreen.css'

function ScoreScreen(props) {
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

    // TODO: Discuss scoring system in group.
    let timePoints = props.timeRemaining * 10;
    let matchPoints = props.score;
    let rawTotal = timePoints + matchPoints;
    let lifeBonus = rawTotal * props.lives;
    let totalScore = rawTotal + lifeBonus;

    return (
        <div className="score" style={{ backgroundColor: theme.backgroundBoxColor }}>
            <h1>{gameOverMessage}</h1>
            <h2 style={{ marginBottom: "10px" }}>
                Time remaining: {props.timeRemaining} seconds
            </h2>
            <h4 style={{ marginTop: 0, marginLeft: "10px" }}>
                {props.timeRemaining} x 10 = {timePoints} points
            </h4>
            <h2 style={{ marginBottom: "10px" }}>
                Card matches: {matchPoints / 100}
            </h2>
            <h4 style={{ marginTop: 0, marginLeft: "10px" }}>
                {matchPoints / 100} x 100 = {matchPoints} points
            </h4>
            <h2 style={{ marginBottom: "10px" }}>
                Lives remaining: {props.lives}
            </h2>
            <h4 style={{ marginTop: 0, marginLeft: "10px" }}>
                + {props.lives}x multiplier
            </h4>
            <hr />
            <h1>
                Total score: {totalScore}
            </h1>
        </div>
    );
}

function SinglePlayerScore(props) {
    return (
        <></>
    );
}

function MultiPlayerScore(props) {
    return (
        <></>
    );
}

export default ScoreScreen;