import React, { useCallback, useState } from 'react';
import MultiGame from './MultiGame';
import Lobby from './Lobby';
import { ServerContext } from './ServerContext';
import useGameServer from './customhooks/useGameServer';
import useRandomizedDeck from './customhooks/useRandomizedDeck';
import ScoreScreen from './ScoreScreen';
import './stylesheets/multiplayer.css'

function Multiplayer(props) {
    const server = useGameServer();

    // Possible states of multiplay: lobby, playing, showing-score
    const [multiplayerState, setMultiplayerState] = useState("lobby");

    // The currently active match. Format: { opponent: string, numberCards: int, firstMove: bool }
    const [activeMatch, setActiveMatch] = useState(null);

    // Custom hook offering functionality for randomizing a deck of cards.
    const { deck, setDeck, getNewDeck } = useRandomizedDeck(0);

    // Stats from both players at the end of a multiplayer game. { playerStats: { score, lives, timer }, opponentStats: { score, lives, timer } }
    const [endGameStats, setEndGameStats] = useState(null);

    const onGameEndCallback = useCallback((playerStats, opponentStats) => {
        setEndGameStats({ playerStats, opponentStats });
        setMultiplayerState("showing-score");
    }, []);

    return (
        <div className="multiplayer">
            <ServerContext.Provider value={server}>
                {multiplayerState === "lobby" && <Lobby
                    multiplayerState={multiplayerState}
                    setMultiplayerState={setMultiplayerState}
                    setActiveMatch={setActiveMatch}
                    deck={deck}
                    setDeck={setDeck}
                    getNewDeck={getNewDeck}
                />}

                {multiplayerState === "playing" && <MultiGame
                    opponent={activeMatch.opponent}
                    numberCards={activeMatch.numberCards}
                    deck={deck}
                    setDeck={setDeck}
                    firstMove={activeMatch.firstMove}
                    onGameEnd={onGameEndCallback}
                    setMultiplayerState={setMultiplayerState}
                />}

                {multiplayerState === "showing-score" && <ScoreScreen 
                    endGameStats={endGameStats}
                />}
            </ServerContext.Provider>
        </div>
    );
}

export default Multiplayer;