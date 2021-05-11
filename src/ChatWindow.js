import React, { useContext, useState } from 'react';
import { ServerContext } from './ServerContext';
import { ThemeContext } from './ThemeContext';

function ChatWindow(props) {
    const theme = useContext(ThemeContext);
    const server = useContext(ServerContext);
    const [messageInput, setMessageInput] = useState("");

    function handleMsgInputChange(event) {
        setMessageInput(event.target.value);
    }

    function handleMsgInputKeyDown(event) {
        if (event.key === 'Enter')
            sendMessage();
    }

    function sendMessage() {
        if (messageInput === "") return;

        server.users.forEach(user => {
            server.sendMessage("chat", user, messageInput);
        });

        setMessageInput("");
    }
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