import React from 'react';
import ChatBox from './ChatBox';

function MultiLobby(props) {


    return (
        <div className="multi-lobby">
            <h1>Waiting for a game...</h1>
            <ChatBox
                users={props.users}
                sendMessage={props.sendMessage}
                messages={props.messages} />
        </div>
    );
}

export default MultiLobby;