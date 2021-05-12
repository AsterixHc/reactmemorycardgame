import React, { useCallback, useContext, useEffect, useState } from 'react';
import ChatWindow from './ChatWindow';
import { ServerContext } from './ServerContext';
import UserList from './UserList';

function MultiLobby(props) {
    const server = useContext(ServerContext);
    const [lobbyState, setLobbyState] = useState("idle"); // idle, invite-sent, invite-received // Maybe don't even need states, idk
    const [invitation, setInvitation] = useState(null);

    const handleInviteUser = useCallback((user, numberCards) => {
        server.sendMessage("GameEvent", user, { type: "invite", numberCards: numberCards });
        console.log("Sent GameEvent message:");
        console.log({ type: "invite", numberCards: numberCards });
    }, [server]);

    // Handles state: idle
    useEffect(() => {
        if (lobbyState !== "idle") return; 
        if (!server.gameEvent) return;
        if (server.gameEvent.content.type !== "invite") return;

        // Handle invite event.
        console.log("entered useEffect");
        setLobbyState("respond-invite");

        // show popup(?)
        setInvitation({user: server.gameEvent.sender, numberCards: server.gameEvent.content.numberCards});

        // case: accept
        // setOpponent(invitingUser);
        // server.sendMessage("GameEvent", opponent, {type: "response", accept: true});
        // setLobbyState("playing");
        // go to MutiGame

        // case: reject
        // server.sendMessage("GameEvent", sender, {type: "response", accept: false});

        // temp: console halløj
        console.log("Received GameEvent message:");
        console.log(server.gameEvent);
    }, [lobbyState, server.gameEvent]);

    return (
        <div className="lobby">
            <UserList inviteUser={handleInviteUser} lobbyState={lobbyState} invitation={invitation}/>
            <ChatWindow />
        </div>
    );
}

export default MultiLobby;