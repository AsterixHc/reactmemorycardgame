import React, { useEffect, useState, useCallback, useContext } from "react"
import useCountdown from "./customhooks/useCountdown"
import Sidebar from "./Sidebar"
import CardContainer from "./CardContainer"
import ChatWindow from "./ChatWindow"
import { ServerContext } from "./ServerContext"

function MultiGame(props) {
    const server = useContext(ServerContext);

    // Destructured props.
    const { opponent, numberCards, deck, setDeck, firstMove, onGameEnd, setMultiplayerState } = props;

    // The cards that player has chosen to flip.
    const [chosenCards, setChosenCards] = useState({ first: null, second: null });

    // The current game state: init, await-card-1, await-card-2, process-choice, opponent-turn, game-over
    const [gameState, setGameState] = useState("init");

    // The current score from matching cards.
    const [score, setScore] = useState(0);

    // The number of remaining lives.
    const [lives, setLives] = useState(5);

    // End-game stats received from opponent player when the game ends.
    const [opponentStats, setOpponentStats] = useState(null);

    // A coundown providing the remaining time.
    const { timer, setRunning: setTimerRunning } = useCountdown((5 * numberCards), false, () => setGameState("game-over"));

    // Handle game state: init
    useEffect(() => {
        if (gameState !== "init") return;

        function flipAllCards() {
            setDeck(prevState => {
                let newState = [...prevState];

                newState.forEach(card => {
                    card.flipped = !card.flipped;
                });

                return newState;
            });
        }

        // After 0.5 seconds, flip all cards for 1.5 seconds.
        let timeout = setTimeout(() => {
            flipAllCards();
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                flipAllCards();
                setTimerRunning(firstMove);
                setGameState(firstMove ? "await-card-1" : "opponent-turn");
                clearTimeout(timeout);
            }, 1500);
        }, 500);

        return () => clearTimeout(timeout);

    }, [gameState, setTimerRunning, firstMove, setDeck]);

    // Handle game state: process-choice
    useEffect(() => {
        if (gameState !== "process-choice") return;

        let first = chosenCards.first;
        let second = chosenCards.second;

        let timeout = setTimeout(() => {
            if (first.sourceId === second.sourceId) { // Match.
                // Hide matched cards.
                first.hidden = true;
                second.hidden = true;

                // Award points for mathcing.
                setScore(prevState => prevState + 100);

                // Handle win condition.
                if (deck.every(card => card.hidden)) {
                    setGameState("game-over");
                    return;
                }
            }
            else { // No match.
                // Flip cards back.
                first.flipped = !first.flipped;
                second.flipped = !second.flipped;

                // Send to opponent: flip cards back.

                // Detract 1 life.
                let prevLives;
                setLives(prevState => {
                    prevLives = prevState;
                    return prevState - 1;
                });

                // Handle lose condition.
                if (prevLives === 1) {
                    setGameState("game-over");
                    return;
                }
            }

            setChosenCards({ first: null, second: null });
            server.sendMessage(opponent, { type: "EndTurn" });
            setTimerRunning(false);
            setGameState("opponent-turn");

        }, 1000);

        return () => clearTimeout(timeout);

    }, [gameState, chosenCards, deck, server, opponent, setTimerRunning]);

    // Handle game state: opponent-turn
    useEffect(() => {
        if (gameState !== "opponent-turn") return;
        if (!server.eventMessage) return;

        let event = server.eventMessage;

        switch (event.type) {
            case "CardFlip":
                let card = deck.find(card => card.id === event.cardId);
                card.flipped = !card.flipped;

                let first = chosenCards.first;
                let second = chosenCards.second;

                if (!first) {
                    first = card;
                }
                else {
                    second = card;
                }

                setChosenCards(prevState => {
                    let newState = { ...prevState };
                    newState.first = first;
                    newState.second = second;

                    return newState;
                });

                // Check match.
                if (first && second) {
                    let timeout = setTimeout(() => {

                        if (first.sourceId === second.sourceId) { // Match.
                            first.hidden = true;
                            second.hidden = true;
                        }
                        else { // No match.
                            first.flipped = !first.flipped;
                            second.flipped = !second.flipped;
                        }

                        clearTimeout(timeout);
                    }, 1000);

                    setChosenCards({ first: null, second: null });
                }

                server.setEventMessage(null);
                break;

            case "EndTurn":
                setTimerRunning(true);
                setGameState("await-card-1");
                server.setEventMessage(null);
                break;

            case "GameOver":
                setOpponentStats(event.stats);
                setGameState("game-over");
                server.setEventMessage(null);
                break;

            default:
                break;
        }
    }, [gameState, server, chosenCards, deck, setTimerRunning]);

    // Handle game state: game-over
    useEffect(() => {
        if (gameState !== "game-over") return;

        setTimerRunning(false);
        let playerStats = {score, lives, timer};
        server.sendMessage(opponent, {type: "GameOver", stats: playerStats});

        if (opponentStats) {
            onGameEnd(playerStats, opponentStats);
        }
        else {
            setGameState("await");
        }

    }, [gameState, setTimerRunning, score, lives, timer, server, opponent, opponentStats, onGameEnd]);

    // Handles game state: await
    useEffect(() => {
        if (gameState !== "await") return;
        if (!server.eventMessage) return;

        let event = server.eventMessage;

        if (event.type === "GameOver") {
            let playerStats = {score, lives, timer};
            onGameEnd(playerStats, event.stats);
        }

        server.setEventMessage(null);
    }, [gameState, server, onGameEnd,  score, lives, timer]);

    useEffect(() => {
        let remoteUser = server.users.find(user => user === opponent);

        if (!remoteUser) {
            console.log("Returning: Remote user disconnected from the server."); // TODO: Inform user some other way(?)
            setMultiplayerState("lobby");
        }
    }, [server.users, opponent, setMultiplayerState]);

    // Callback to handle card click.
    const handleCardClick = useCallback(id => {
        if (gameState !== "await-card-1" && gameState !== "await-card-2") return;
        if (chosenCards.first && chosenCards.first.id === id) return;

        let card = deck.find(card => card.id === id);

        // Flip card.
        card.flipped = !card.flipped;

        // Send card id to opponent.
        server.sendMessage(opponent, { type: "CardFlip", cardId: id });

        // Set card as chosen, update game state.
        setChosenCards(prevState => {
            let newState = { ...prevState };

            if (!chosenCards.first) {
                newState.first = card;
                setGameState("await-card-2");
            }
            else {
                newState.second = card;
                setGameState("process-choice");
            }

            return newState;
        });

    }, [gameState, chosenCards, deck, opponent, server])

    return (
        <div className="game multiplayer">
            <CardContainer deck={deck} handleCardClick={handleCardClick} />
            <div className="multi-side">
                <Sidebar score={score} lives={lives} timeRemaining={timer} />
                <ChatWindow opponent={opponent} />
            </div>
        </div>
    )
}

export default MultiGame;