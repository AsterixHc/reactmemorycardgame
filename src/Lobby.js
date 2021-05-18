import React, { useContext, useEffect, useState, useCallback } from 'react';
import ChatWindow from './ChatWindow';
import { ServerContext } from './ServerContext';
import UserList from './UserList';
import './stylesheets/lobby.css';

function Lobby(props) {
    const server = useContext(ServerContext);
    const [invitation, setInvitation] = useState(null); // An invitation to play a game. Format: {opponent: string, numberCards: integer }

    // Invites another user to play a game.
    const handleInviteUser = useCallback((user, numberCards) => {
        server.sendMessage(user, { type: "Invite", numberCards });
        setInvitation({ opponent: user, numberCards });
        props.setMultiplayerState("await");
    }, [server, props]);

    // Cancels the pending invitation that was send to another player.
    const handleCancelInvite = useCallback(() => {
        server.sendMessage(invitation.opponent, { type: "Abort", reason: "Cancelled" });
        setInvitation(null);
        props.setMultiplayerState("idle");
    }, [server, invitation, props]);

    const handleAcceptInvite = useCallback(() => {
        server.sendMessage(invitation.opponent, { type: "Response", accepted: true });
        props.setMultiplayerState("await");
    }, [server, invitation, props]);

    const handleDeclineInvite = useCallback(() => {
        server.sendMessage(invitation.opponent, { type: "Response", accepted: false });
        setInvitation(null);
        props.setMultiplayerState("idle");
    }, [server, invitation, props]);

    // Handles server messages while state is "idle".
    useEffect(() => {
        if (props.multiplayerState !== "idle") return;
        if (!server.eventMessage) return;

        let event = server.eventMessage;

        if (event.type === "Invite") {
            setInvitation({ opponent: event.sender, numberCards: event.numberCards });
            props.setMultiplayerState("invited");
            server.setEventMessage(null);
        }
    }, [server, props]);

    // Handles server messages while state is "await".
    useEffect(() => {
        if (props.multiplayerState !== "await") return;
        if (!server.eventMessage) return;

        let event = server.eventMessage;

        switch (event.type) {
            case "Invite":
                server.sendMessage(event.sender, { type: "Abort", reason: "Busy" });
                server.setEventMessage(null);
                break;

            case "Response":
                if (event.accepted) {
                    let firstMove = (Math.random() > 0.5);
                    let tempDeck = props.getDeck(invitation.numberCards);
                    server.sendMessage(invitation.opponent, { type: "Game", firstMove: !firstMove, deck: tempDeck });
                    props.setActiveMatch({ opponent: invitation.opponent, firstMove });
                    props.setMultiplayerState("playing");
                }
                else {
                    props.setMultiplayerState("idle");
                    setInvitation(null);
                }

                server.setEventMessage(null);
                break;

            case "Abort":
                console.log("Invitation was aborted by remote user with the reason: " + event.reason); // TODO: Inform user some other way(?)
                props.setMultiplayerState("idle");
                setInvitation(null);
                server.setEventMessage(null);
                break;

            case "Game":
                props.setActiveMatch({ opponent: invitation.opponent, firstMove: event.firstMove });
                props.setDeck(event.deck);
                props.setMultiplayerState("playing");
                break;

            default:
                break;
        }
    }, [server, invitation, props]);

    // Handles server messages while state is "invited".
    useEffect(() => {
        if (props.multiplayerState !== "invited") return;
        if (!server.eventMessage) return;

        let event = server.eventMessage;

        switch (event.type) {
            case "Invite":
                server.sendMessage(event.sender, { type: "Abort", reason: "Busy" });
                server.setEventMessage(null);
                break;

            case "Abort":
                console.log("Invitation was aborted by remote user with the reason: " + event.reason); // TODO: Inform user some other way(?)
                props.setMultiplayerState("idle");
                setInvitation(null);
                server.setEventMessage(null);
                break;

            default:
                break;
        }

    }, [server, props, server.eventMessage]);

    // Handles remote user disconnect.
    useEffect(() => {
        if (!invitation) return;

        let remoteUser = server.users.find(user => user === invitation.opponent);
        if (!remoteUser) {
            console.log("Returning: Remote user disconnected from the server."); // TODO: Inform user some other way(?)
            setInvitation(null);
            props.setMultiplayerState("idle");
        }
    }, [invitation, server.users, props]);

    return (
        <div className="lobby">
            <UserList
                handleInviteUser={handleInviteUser}
                handleCancelInvite={handleCancelInvite}
                handleAcceptInvite={handleAcceptInvite}
                handleDeclineInvite={handleDeclineInvite}
                multiplayerState={props.multiplayerState}
                invitation={invitation} />
            <ChatWindow />
        </div>
    );
}

export default Lobby;