import React from 'react';

function ChatBox(props) {
    return (
        <div className="chat-box">
            <div className="user-list">
                <h3>Active users:</h3>
                {props.users.map(user => <p>{user}</p>)}
            </div>
            <div className="messages">

            </div>
        </div>
    );
}

export default ChatBox;