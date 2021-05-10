import React, { useCallback, useEffect, useState } from 'react';
import MultiGame from './MultiGame';
import MultiLobby from './MultiLobby';
import useGameServer from './useGameServer';

function Multiplayer(props) {
    const { server, users, messages } = useGameServer(10);
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
                    messages={messages}
                    setActiveScreen={props.setActiveScreen}
                    onGameEnd={props.onGameEndCallback}
                    numberCards={props.numberCards}
                />
                : <MultiLobby
                    sendMessage={sendMessage}
                    users={users}
                    messages={messages} />
            }
        </>
    );
}

export default Multiplayer;