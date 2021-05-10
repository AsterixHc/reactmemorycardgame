import React, { useCallback, useEffect, useState } from 'react';
import MultiGame from './MultiGame';
import MultiLobby from './MultiLobby';
import useGameServer from './useGameServer';

function Multiplayer(props) {
    const { server, users } = useGameServer();
    const [opponent, setOpponent] = useState(null);

    useEffect(() => {
        if (opponent) return;

        // while not in a game, request other users for a game.
    }, [opponent]);

    const sendMessage = useCallback((receiver, msg) => {
        server.invoke("Message", receiver, msg)
    }, [server]);

    return (
        <>
            {opponent
                ? <MultiGame
                    sendMessage={sendMessage}
                    users={users}
                    setActiveScreen={props.setActiveScreen}
                    onGameEnd={props.onGameEndCallback}
                    numberCards={props.numberCards}
                />
                : <MultiLobby sendMessage={sendMessage} />
            }
        </>
    );
}

export default Multiplayer;