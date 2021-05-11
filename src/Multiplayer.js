import React, { useEffect, useState } from 'react';
import MultiGame from './MultiGame';
import MultiLobby from './MultiLobby';
import { ServerContext } from './ServerContext';
import useGameServer from './useGameServer';

function Multiplayer(props) {
    const server = useGameServer();
    const [opponent] = useState(null);

    useEffect(() => {
        if (opponent) return;

        // Logic for getting a match with another player goes here.

        // while not in a game, request other users for a game.
        // OR set up an invite system, may be just as easy/easier.
    }, [opponent]);

    return (
        <div className="multiplayer">
            <ServerContext.Provider value={server}>
                {opponent
                    ? <MultiGame
                        setActiveScreen={props.setActiveScreen} // test this, might need callbacks.
                        onGameEnd={props.onGameEndCallback} // test this, might need callbacks.
                        numberCards={props.numberCards}
                    />
                    : <MultiLobby />
                }
            </ServerContext.Provider>
        </div>
    );
}

export default Multiplayer;