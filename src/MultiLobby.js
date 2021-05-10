import React from 'react';
import ChatBox from './ChatBox';

function MultiLobby(props) {


    return(
        <div className="multi-lobby">
            <h1>Waiting for a game...</h1>
            <ChatBox />
        </div>
    );
}

export default MultiLobby;