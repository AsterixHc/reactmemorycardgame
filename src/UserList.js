import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ServerContext } from './ServerContext';
import { ThemeContext } from './ThemeContext';
import './stylesheets/userlist.css';

function UserList(props) {
    const theme = useContext(ThemeContext);
    const server = useContext(ServerContext);
    const [selectedUser, setSelectedUser] = useState("");

    const handleSelectUser = useCallback(user => {
        setSelectedUser(selectedUser === user ? "" : user);
    }, [selectedUser]);

    const handleInviteUser = useCallback(numberCards => {
        props.handleInviteUser(selectedUser, numberCards);
    }, [selectedUser, props]);

    // Reset selection when returning to idle state.
    useEffect(() => {
        if (props.multiplayerState === "idle") {
            setSelectedUser("");
        }
    }, [props.multiplayerState]);

    // Gets the appropriate user list item, depending on the state.
    function getUserListItem(user) {
        switch (props.multiplayerState) {
            case "idle":
                return <IdleUserListItem
                    user={user}
                    isSelected={selectedUser === user}
                    handleSelectUser={handleSelectUser}
                    handleInviteUser={handleInviteUser}
                />

            case "await":
                return <AwaitUserListItem
                    user={user}
                    isInvited={selectedUser === user}
                    handleCancelInvite={props.handleCancelInvite}
                />

            case "invited":
                return <InvitedUserListItem
                    user={user}
                    isInvitationSender={props.invitation.opponent === user}
                    numberCards={props.invitation.numberCards}
                    handleAcceptInvite={props.handleAcceptInvite}
                    handleDeclineInvite={props.handleDeclineInvite}
                />

            default:
                return <span>{user}</span>;
        }
    }

    return (
        <div className="user-list" style={{ backgroundColor: theme.backgroundBoxColor }}>
            <h3>Online users</h3>

            {server.users.map(user =>
                <div key={user} className="item">
                    {getUserListItem(user)}
                </div>
            )}

        </div>
    );
}

// Items that populate the user list while state is "idle."
function IdleUserListItem(props) {

    const [numberCards, setNumberCards] = useState(10);

    const handleNumberCardsChange = useCallback(event => {
        setNumberCards(event.target.value);
    }, []);

    const handleInviteUser = useCallback(() => {
        props.handleInviteUser(numberCards);
    }, [numberCards, props]);

    const handleSelectUser = useCallback(() => {
        props.handleSelectUser(props.user);
    }, [props]);

    const inviteUserForm = <>
        <div className="notification">
            <label>Cards:</label>
            <select value={numberCards} onChange={handleNumberCardsChange}>
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
        </div>
        <div className="buttons">
            <button onClick={handleInviteUser}>Invite</button>
        </div>
    </>;

    return (
        <>
            <div className="name clickable">
                {props.isSelected
                    ? <span onClick={handleSelectUser}><b>{props.user}</b></span>
                    : <span onClick={handleSelectUser}>{props.user}</span>
                }
            </div>

            {props.isSelected && inviteUserForm}
        </>
    );
}

// Items that populate the user list while state is "await."
function AwaitUserListItem(props) {

    const cancelInvitationForm = <>
        <div className="notification">
            <span>Invite sent!</span>
        </div>
        <div className="buttons">
            <button onClick={() => props.handleCancelInvite()}>Cancel</button>
        </div>
    </>;

    return (
        <>
            <div className="name">
                {props.isInvited
                    ? <span><b>{props.user}</b></span>
                    : <span>{props.user}</span>
                }
            </div>

            {props.isInvited && cancelInvitationForm}
        </>
    );
}

// Items that populate the user list while state is "invited."
function InvitedUserListItem(props) {

    const respondInvitationForm = <>
        <div className="notification">
            <span>This user has invited you to a game with {props.numberCards} cards.</span>
        </div>
        <div className="buttons">
            <button onClick={() => props.handleAcceptInvite()}>Accept</button>
            <button onClick={() => props.handleDeclineInvite()}>Decline</button>
        </div>
    </>;

    return (
        <>
            <div className="name">
                {props.isInvitationSender
                    ? <span><b>{props.user}</b></span>
                    : <span>{props.user}</span>
                }
            </div>

            {props.isInvitationSender && respondInvitationForm}
        </>
    );
}

export default UserList;