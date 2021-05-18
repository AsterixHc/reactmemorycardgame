import React, { useCallback, useContext, useState } from 'react';
import { ServerContext } from './ServerContext';
import { ThemeContext } from './ThemeContext';
import './stylesheets/chatwindow.css';

function ChatWindow(props) {
    const theme = useContext(ThemeContext);
    const server = useContext(ServerContext);
    const [messageInput, setMessageInput] = useState("");

    const sendMessage = useCallback(() => {
        if (messageInput === "") return;

        server.users.forEach(user => {
            server.sendMessage(user, { type: "Chat", message: messageInput });
        });

        server.setChatMessages(prevState => {
            let newState = [...prevState];
            newState.push("Me: " + messageInput);

            if (newState.length > 10) {
                newState.shift();
            }

            return newState;
        });

        setMessageInput("");
    }, [messageInput, server]);

    const handleMsgInputChange = useCallback(event => {
        setMessageInput(event.target.value);
    }, []);

    const handleMsgInputKeyDown = useCallback(event => {
        if (event.key === 'Enter')
            sendMessage();
    }, [sendMessage]);

    return (
        <div className="chat-window" style={{ backgroundColor: theme.backgroundBoxColor }}>
            <textarea className="messages" readOnly={true} value={server.chatMessages.join("\n")} />
            <div className="input">
                <input onChange={handleMsgInputChange} onKeyDown={handleMsgInputKeyDown} value={messageInput}></input>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatWindow;