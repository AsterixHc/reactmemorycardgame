import React, { useState } from 'react';
import MultiGame from './MultiGame';
import Lobby from './Lobby';
import { ServerContext } from './ServerContext';
import useGameServer from './customhooks/useGameServer';
import useRandomizedDeck from './customhooks/useRandomizedDeck';

function Multiplayer(props) {
    const server = useGameServer();
    const [multiplayerState, setMultiplayerState] = useState("idle"); // Possible states of multiplay: idle, await, invited, playing, show-score
    const [activeMatch, setActiveMatch] = useState(null); // {opponent: string, firstMove: bool}
    const {deck, setDeck, get: getDeck} = useRandomizedDeck();

    return (
        <div className="multiplayer">
            <ServerContext.Provider value={server}>
                {multiplayerState !== "playing"
                    ? <Lobby
                        multiplayerState={multiplayerState}
                        setMultiplayerState={setMultiplayerState}
                        setActiveMatch={setActiveMatch}
                        deck={deck}
                        getDeck={getDeck}
                        setDeck={setDeck}
                    />
                    : <MultiGame
                        setMultiplayerState={setMultiplayerState} // May not need this - Lobby->MutiGame->Lobby etc. (do something else with score screen)
                        opponent={activeMatch.opponent}
                        deck={deck}
                        setDeck={setDeck}
                        firstMove={activeMatch.firstMove}
                    />
                }
            </ServerContext.Provider>
        </div>
    );
}

export default Multiplayer;