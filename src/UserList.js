import React, { useCallback, useContext, useState } from 'react';
import { ServerContext } from './ServerContext';
import { ThemeContext } from './ThemeContext';

function UserList(props) {
    const theme = useContext(ThemeContext);
    const server = useContext(ServerContext);
    const [selectedUser, setSelectedUser] = useState("");

    const onSelectUser = useCallback(user => {
        setSelectedUser(selectedUser === user ? "" : user);
    }, [selectedUser]);

    const onInviteUser = useCallback(numberCards => {
        props.inviteUser(selectedUser, numberCards);
    }, [props, selectedUser]);

    return (
        <div className="user-list" style={{ backgroundColor: theme.backgroundBoxColor }}>
            <h3>Active users:</h3>
            {server.users.map(user =>
                <UserListItem
                    key={user}
                    user={user}
                    // isInvitingUser={props.invitingUser === user}
                    lobbyState={props.lobbyState}
                    invitation={props.invitation}
                    isSelected={selectedUser === user}
                    onSelect={onSelectUser}
                    onClickInvite={onInviteUser}
                />
            )}
        </div>
    );
}

function UserListItem(props) {
    const [numberCards, setNumberCards] = useState(10);

    const handleNumberCardsChange = useCallback(event => {
        setNumberCards(event.target.value);
    }, []);

    const onClickInvite = useCallback(() => {
        props.onClickInvite(numberCards);
    }, [props, numberCards]);

    if (props.lobbyState === "idle") {
        return (
            <div className="item">
                <span
                    onClick={() => { props.onSelect(props.user) }}
                    style={props.isSelected ? { fontWeight: "bold" } : {}}
                >
                    {props.user}
                </span>
                {props.isSelected && <div>
                    <label>Cards: </label>
                    <select value={numberCards} onChange={handleNumberCardsChange}>
                        <option>2</option>
                        <option>4</option>
                        <option>6</option>
                        <option>10</option>
                        <option>12</option>
                        <option>14</option>
                        <option>16</option>
                        <option>18</option>
                        <option>20</option>
                        <option>104</option>
                    </select>
                </div>}
                {props.isSelected && <button onClick={onClickInvite}>Invite</button>}
            </div>
        );
    }
    else if (props.lobbyState === "respond-invite" && props.invitation.user === props.user) {
        return (
            <div className="item">
                <span style={{fontWeight: "bold"}}>{props.user}</span>
                <label>Invited to game with {props.invite.numberCards} cards!</label>
                <div>
                    <button>Accept</button>
                    <button>Reject</button>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="item">
                {props.user}
            </div>
        );
    }
}

export default UserList;