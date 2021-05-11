import React, { useContext } from 'react';
import ChatWindow from './ChatWindow';
import { ServerContext } from './ServerContext';
import { ThemeContext } from './ThemeContext';

function MultiLobby(props) {
    const theme = useContext(ThemeContext);
    const server = useContext(ServerContext);

    return (
        <div className="lobby">
            <div className="user-list" style={{backgroundColor: theme.backgroundBoxColor}}>
                <h3>Active users:</h3>
                {server.users.map(user => <p key={user}>{user}</p>)}
            </div>
            <ChatWindow />
        </div>
    );
}

export default MultiLobby;