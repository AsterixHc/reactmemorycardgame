import { useEffect, useMemo, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

function useGameServer(numberMessagesSaved) {
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

    const [messages, setMessages] = useState([]);

    // Subscribes to server events with callbacks to handle them.
    useEffect(() => {

        // Sets initial users upon making a successful connection.
        server.on("ConnectedUsers", users => {
            setUsers(users);

            console.log("Connected users: " + users);

        });

        server.on("UserConnected", user => {
            setUsers(prevState => {
                let newState = [...prevState];
                newState.push(user);

                return newState;
            });

            console.log("user connected: " + user);
        });

        server.on("UserDisconnected", user => {
            setUsers(prevState => {
                let newState = [...prevState];
                let userIndex = newState.findIndex(element => element === user); // ? Maybe this is fine - test later: newstate.findIndex(user)
                newState.splice(userIndex, 1);

                return newState;
            });

            console.log("user disconnected: " + user);
        });

        server.on("Message", (sender, msg) => {
            setMessages(prevState => {
                let newState = [...prevState];

                newState.push(sender + ": " + msg);

                if (newState.length > numberMessagesSaved) {
                    newState.shift();
                }

                return newState;
            });
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

    return { server, users, messages } // What to return here? TBD
}

export default useGameServer;