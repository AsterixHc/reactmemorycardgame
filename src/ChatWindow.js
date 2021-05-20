import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ServerContext } from './ServerContext';
import { ThemeContext } from './ThemeContext';
import './stylesheets/chatwindow.css';

function ChatWindow(props) {
    const { opponent } = props;
    const theme = useContext(ThemeContext);
    const server = useContext(ServerContext);
    const [messageInput, setMessageInput] = useState("");
    const[opponentMessages, setOpponentMessages] = useState([]);

    const sendMessage = useCallback(() => {
        if (messageInput === "") return;

        if (opponent) {
            server.sendMessage(opponent, { type: "Chat", message: messageInput });
        }
        else {
            server.users.forEach(user => {
                server.sendMessage(user, { type: "Chat", message: messageInput });
            });
        }

        server.setChatMessages(prevState => {
            let newState = [...prevState];
            newState.push("Me: " + messageInput);

            if (newState.length > 10) {
                newState.shift();
            }

            return newState;
        });

        setMessageInput("");
    }, [messageInput, server, opponent]);

    // TODO: Revamp chatMessages with sender and message.
    useEffect(() => {
        let temp = [];
        server.chatMessages.forEach(message => {
            if ( message.includes(opponent + " :") || message.includes("Me: ")) {
                temp.push(message);
            }
        });

        setOpponentMessages(temp);

    }, [opponent, server.chatMessages]);

    const handleMsgInputChange = useCallback(event => {
        setMessageInput(event.target.value);
    }, []);

    const handleMsgInputKeyDown = useCallback(event => {
        if (event.key === 'Enter')
            sendMessage();
    }, [sendMessage]);

    return (
        <div className="chat-window" style={{ backgroundColor: theme.backgroundBoxColor }}>
            <textarea className="messages" readOnly={true} value={opponent ? opponentMessages.join("\n") : server.chatMessages.join("\n")} />
            <div className="input">
                <input onChange={handleMsgInputChange} onKeyDown={handleMsgInputKeyDown} value={messageInput}></input>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatWindow;