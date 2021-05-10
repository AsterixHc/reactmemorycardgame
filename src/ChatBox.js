import React, { useState } from 'react';

function ChatBox(props) {
    const [messageInput, setMessageInput] = useState("");

    function handleMessageInputChange(event) {
        setMessageInput(event.target.value);
    }

    function handleSendMessage() {
        props.users.forEach(user => {
            props.sendMessage(user, messageInput);
        });

        setMessageInput("");
    }

    return (
        <div className="chat-box">
            <div className="user-list">
                <h3>Active users:</h3>
                {props.users.map(user => <p>{user}</p>)}
            </div>
            <div className="messages">

            </div>

            <input className="message-input" onChange={handleMessageInputChange} value={messageInput}></input>
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default ChatBox;