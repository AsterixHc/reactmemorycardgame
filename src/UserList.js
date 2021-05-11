import React, { useCallback, useContext, useState } from 'react';
import { ServerContext } from './ServerContext';
import { ThemeContext } from './ThemeContext';

function UserList(props) {
    const theme = useContext(ThemeContext);
    const server = useContext(ServerContext);
    const [selectedUser, setSelectedUser] = useState("");

    const onSelectUser = useCallback(user => {
        setSelectedUser(user);
    }, []);

    const onInviteUser = useCallback(() => {
        server.sendMessage("gameEvent", selectedUser, JSON.stringify({type: "invite", numberCards: 10}));
        console.log(JSON.stringify({type: "invite", numberCards: 10}));
    }, [server, selectedUser]);

    return (
        <div className="user-list" style={{ backgroundColor: theme.backgroundBoxColor }}>
            <h3>Active users:</h3>
            {server.users.map(user =>
                <UserListItem
                    key={user}
                    user={user}
                    isSelected={selectedUser === user}
                    onSelect={onSelectUser}
                    onClickInvite={onInviteUser}
                />
            )}
        </div>
    );
}

function UserListItem(props) {

    const onClickInvite = useCallback(() => {
        props.onClickInvite();
    }, [props]);

    return (
        <div>
            <p
                onClick={() => { props.onSelect(props.user) }}
                style={props.isSelected ? { fontStyle: "italic" } : {fontStyle: "none"}}
            >
                {props.user}
                {props.isSelected && <button onClick={onClickInvite}>Invite</button>}
            </p>
        </div>
    );
}

export default UserList;