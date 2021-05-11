import React, { useContext } from 'react';
import ChatWindow from './ChatWindow';
import UserList from './UserList';
import { ServerContext } from './ServerContext';
import { ThemeContext } from './ThemeContext';

function MultiLobby(props) {
    const theme = useContext(ThemeContext);
    const server = useContext(ServerContext);

    return (
        <div className="lobby">
            <UserList />
            <ChatWindow />
        </div>
    );
}

export default MultiLobby;