import { useCallback, useEffect, useMemo, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

function useGameServer() {
    // Creates the server object.
    const connection = useMemo(() => {
        return (
            new HubConnectionBuilder()
                .withUrl("http://jats.web.eadania.dk/proxyhub")
                .build()
        );
    }, []);

    // All users currently connected to the server.
    const [users, setUsers] = useState([]);

    // Array of the latest messages received from other users.
    const [gameEvent, setGameEvent] = useState(null);

    const [chatMessages, setChatMessages] = useState([]);

    const sendMessage = useCallback((type, receiver, content) => {
        // Ensures own chat messages show in messages array.
        if (type === "Chat") {
            setChatMessages(prevState => {
                let newState = [...prevState];
                newState.push("Me: " + content);

                if (newState.length > 10) {
                    newState.shift();
                }

                return newState;
            });
        }

        let msgObject = { type, content };
        connection.invoke("Message", receiver, JSON.stringify(msgObject));
    }, [connection]);

    // Subscribes to server events with callbacks to handle them.
    useEffect(() => {

        // Sets initial users upon making a successful connection.
        connection.on("ConnectedUsers", users => {
            setUsers(users);
        });

        connection.on("UserConnected", user => {
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

        connection.on("UserDisconnected", user => {
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

        connection.on("Message", (sender, msg) => {

            let msgObject= JSON.parse(msg);

            if (msgObject.type === "Chat") {
                setChatMessages(prevState => {
                    let newState = [...prevState];
                    newState.push(sender + ": " + msgObject.content);

                    if (newState.length > 10) {
                        newState.shift();
                    }

                    return newState;
                });
            }

            if (msgObject.type === "GameEvent") {
                setGameEvent({sender, ...msgObject});
            }
        });

        connection.start()
            .then(() => console.log("Connected to server!"))
            .catch(error => console.log(error));

        return () => {
            connection.off("ConnectedUsers");
            connection.off("UserConnected");
            connection.off("UserDisconnected");
            connection.off("Message");
            connection.stop()
                .then(() => console.log("Disconnected from server."));
        }
    }, [connection]);

    // return { server, users, messages };
    return { users, chatMessages, gameEvent, sendMessage };
}

export default useGameServer;