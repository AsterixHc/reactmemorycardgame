import { useCallback, useEffect, useMemo, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

function useGameServer() {
    // Creates the server object.
    const server = useMemo(() => {
        return (
            new HubConnectionBuilder()
                .withUrl("http://jats.web.eadania.dk/proxyhub")
                .build()
        );
    }, []);

    // All users currently connected to the server.
    const [users, setUsers] = useState([]);

    // Array of the latest messages received from other users.
    const [gameEventMessages, setGameEventMessages] = useState([]);

    const [chatMessages, setChatMessages] = useState([]);

    // TODO: Split messages up into 2 states: chat and system?

    // const invoke = useCallback((methodName, ...args) => {
    //     server.invoke(methodName, ...args)
    //     .catch(() => console.warn("Failed to invoke method: " + methodName));
    // }, [server]);

    const sendMessage = useCallback((msgType, receiver, msg) => {
        // construct JSON object.
        let json = {
            type: msgType,
            content: msg
        }

        console.log("constructed json: " + json);

        // send JSON object.
        server.invoke("Message", receiver, JSON.stringify(json))
    }, [server]);

    // Subscribes to server events with callbacks to handle them.
    useEffect(() => {

        // Sets initial users upon making a successful connection.
        server.on("ConnectedUsers", users => {
            setUsers(users);
        });

        server.on("UserConnected", user => {
            setUsers(prevState => {
                let newState = [...prevState];
                newState.push(user);

                return newState;
            });

            setChatMessages(prevState => {
                let newState = [...prevState];
                newState.push(user + " connected!");

                if (newState.length > 10) {
                    newState.shift();
                }

                return newState;
            });
        });

        server.on("UserDisconnected", user => {
            setUsers(prevState => {
                let newState = [...prevState];
                let userIndex = newState.findIndex(element => element === user);
                newState.splice(userIndex, 1);

                return newState;
            });

            setChatMessages(prevState => {
                let newState = [...prevState];
                newState.push(user + " disconnected!");

                if (newState.length > 10) {
                    newState.shift();
                }

                return newState;
            });
        });

        server.on("Message", (sender, msg) => {

            // sort message into states according to its type
            let json = msg.json();
            console.log("received json: " + json);

            if (json.msgType === "chat") {
                setChatMessages(prevState => {
                    let newState = [...prevState];
    
                    newState.push(sender + ": " + json.msg);
    
                    if (newState.length > 10) {
                        newState.shift();
                    }
    
                    return newState;
                });
            }

            if (json.msgType === "gameEvent") {
                // noget andet...
            }
        });

        server.start()
            .then(() => console.log("Connected to server!"))
            .catch(error => console.log(error));

        return () => {
            server.off("ConnectedUsers");
            server.off("UserConnected");
            server.off("UserDisconnected");
            server.off("Message");
            server.stop()
                .then(() => console.log("Disconnected from server."));
        }
    }, [server]);

    // return { server, users, messages };
    return {users, chatMessages, gameEventMessages, sendMessage};
}

export default useGameServer;