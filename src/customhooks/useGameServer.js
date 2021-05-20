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
    const [eventMessage, setEventMessage] = useState(null);

    const [chatMessages, setChatMessages] = useState([]);

    const sendMessage = useCallback((receiver, content) => {
        connection.invoke("Message", receiver, JSON.stringify(content));
    }, [connection]);

    // Subscribes to server events with callbacks to handle them.
    useEffect(() => {

        // Sets initial users upon making a successful connection.
        connection.on("ConnectedUsers", users => {
            setUsers(users);
        });

        // Handles a new user connecting.
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

        // Handles a user disconencting.
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

        // Handles receiving a message from a user.
        connection.on("Message", (sender, content) => {

            let contentObj = JSON.parse(content);

            // Store chat messages separately, otherwise set the eventMessage state.
            if (contentObj.type === "Chat") {
                setChatMessages(prevState => {
                    let newState = [...prevState];
                    newState.push(sender + ": " + contentObj.message);

                    if (newState.length > 10) {
                        newState.shift();
                    }

                    return newState;
                });
            }
            else {
                setEventMessage({ sender, ...contentObj });
            }
        });

        // Starts the connection to server.
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

    return { users, chatMessages, setChatMessages, eventMessage, setEventMessage, sendMessage };
}

export default useGameServer;