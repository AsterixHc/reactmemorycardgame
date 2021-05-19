import React, { useCallback, useEffect, useState } from 'react';
import MultiGame from './MultiGame';
import Lobby from './Lobby';
import { ServerContext } from './ServerContext';
import useGameServer from './customhooks/useGameServer';
import useRandomizedDeck from './customhooks/useRandomizedDeck';
import ScoreScreen from './ScoreScreen';

function Multiplayer(props) {
    const server = useGameServer();

    // Possible states of multiplay: lobby, playing, showing-score
    const [multiplayerState, setMultiplayerState] = useState("lobby");

    // The currently active match. Format: { opponent: string, numberCards: int, firstMove: bool }
    const [activeMatch, setActiveMatch] = useState(null);

    // Custom hook offering functionality for randomizing a deck of cards.
    const { deck, setDeck, getNewDeck } = useRandomizedDeck(0);

    const [endGameStats, setEndGameStats] = useState({ myGameStats: {}, opponentGameStats: {} });

    const endGameCallback = useCallback((myGameStats, opponentGameStats) => {
        let { score, lives, timer } = myGameStats;
        let { opponentScore, opponentLives, opponentTimer } = opponentGameStats;

        setEndGameStats({ myGameStats, opponentGameStats });

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
                    setMultiplayerState={setMultiplayerState}
                    opponent={activeMatch.opponent}
                    deck={deck}
                    setDeck={setDeck}
                    firstMove={activeMatch.firstMove}
                    endGameCallback={endGameCallback}
                />}

                {multiplayerState === "showing-score" && <ScoreScreen 
                    endGameStats={endGameStats}
                />}
            </ServerContext.Provider>
        </div>
    );
}

export default Multiplayer;