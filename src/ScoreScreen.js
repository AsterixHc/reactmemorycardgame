import React, { useContext, useEffect, useState } from "react"
import { ThemeContext } from "./ThemeContext";
import './stylesheets/scorescreen.css'

function ScoreScreen(props) {
    const theme = useContext(ThemeContext);
    const playerStats = props.endGameStats.playerStats;
    const opponentStats = props.endGameStats.opponentStats;

    return(
        <>
            <div className="multiplayer-verdict" style={{ backgroundColor: theme.backgroundBoxColor }}>
                {opponentStats && <MultiplayerVerdict playerStats={playerStats} opponentStats={opponentStats}/>}
            </div>
            <div className="score-components">
                <Score stats={playerStats} multiplayer={opponentStats !== undefined}/>
                {opponentStats && <Score stats={opponentStats} multiplayer={true}/>}
            </div>
        </>
    );
}

function Score(props) {
    const theme = useContext(ThemeContext);

    const {stats, multiplayer} = props;

    console.log(stats);

    let gameOverMessage;

    if (stats.lives === 0) {
        gameOverMessage = "Game over: Ran out of lives!";
    }
    else if (stats.timer <= 0) {
        gameOverMessage = "Game over: Ran out of time!";
    }
    else {
        gameOverMessage = "All cards cleared!";
    }

    let timePoints = stats.timer * 10;
    let matchPoints = stats.score;
    let rawTotal = timePoints + matchPoints;
    let lifeBonus = rawTotal * stats.lives;
    let totalScore = rawTotal + lifeBonus;

    return (
        <div className="score" style={{ backgroundColor: theme.backgroundBoxColor }}>
            {!multiplayer && <h1>{gameOverMessage}</h1>}
            <h2 style={{ marginBottom: "10px" }}>
                Time remaining: {stats.timer} seconds
            </h2>
            <h4 style={{ marginTop: 0, marginLeft: "10px" }}>
                {stats.timer} x 10 = {timePoints} points
            </h4>
            <h2 style={{ marginBottom: "10px" }}>
                Card matches: {matchPoints / 100}
            </h2>
            <h4 style={{ marginTop: 0, marginLeft: "10px" }}>
                {matchPoints / 100} x 100 = {matchPoints} points
            </h4>
            <h2 style={{ marginBottom: "10px" }}>
                Lives remaining: {stats.lives}
            </h2>
            <h4 style={{ marginTop: 0, marginLeft: "10px" }}>
                + {stats.lives}x multiplier
            </h4>
            <hr />
            <h1>
                Total score: {totalScore}
            </h1>
        </div>
    );
}

function MultiplayerVerdict(props) {
    const {playerStats, opponentStats} = props;
    const [winner, setWinner] = useState("");

    useEffect(() => {
        const playerRaw = (playerStats.timer * 10) + playerStats.score;
        const playerTotal = playerRaw + (playerStats.lives * playerRaw);

        const opponentRaw = (opponentStats.timer * 10) + opponentStats.score;
        const opponentTotal = opponentRaw + (opponentStats.lives * opponentRaw);

        setWinner(prevState => {
            let newState = prevState;

            if (opponentStats.timer === 0 || opponentStats.lives === 0) {
                console.log("opponentStats.timer === 0 || opponentStats.lives === 0");
                newState = "You";
            }
            else if (playerStats.timer === 0 || playerStats.lives === 0) {
                console.log("playerStats.timer === 0 || playerStats.lives === 0");
                newState = "Opponent";
            }
            else if (playerTotal > opponentTotal) {
                console.log("playerStats.score > opponentStats.score");
                newState = "You";
            }
            else if (playerTotal < opponentTotal) {
                console.log("playerStats.score < opponentStats.score");
                newState = "Opponent";
            }
            else if (playerTotal === opponentTotal) {
                console.log("playerStats.score === opponentStats.score");
                console.log(playerStats.score);
                console.log(opponentStats.score);
                newState = "Nobody";
            }

            return newState;
        });

    }, [playerStats, opponentStats]);
    return (
        <>
            <h1>{winner} won!</h1>
        </>
    );
}

export default ScoreScreen;