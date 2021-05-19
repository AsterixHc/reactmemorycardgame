import React, { useEffect, useState, useCallback, useContext } from "react"
import useCountdown from "./customhooks/useCountdown"
import Sidebar from "./Sidebar"
import CardContainer from "./CardContainer"
import ChatWindow from "./ChatWindow"
import { ServerContext } from "./ServerContext"

function MultiGame(props) {
    const server = useContext(ServerContext);
    
    // Destructured props.
    const { setMultiplayerState, opponent, deck, setDeck, firstMove, endGameCallback } = props;

    // The cards that player has chosen to flip.
    const [chosenCards, setChosenCards] = useState({ first: null, second: null });

    // The current game state: init, await-card-1, await-card-2, process-choice, opponent-turn, game-over
    const [gameState, setGameState] = useState("init");

    // The current score from matching cards.
    const [score, setScore] = useState(0);

    // The number of remaining lives.
    const [lives, setLives] = useState(5);

    // A coundown providing the remaining time.
    const { timer, setRunning: setTimerRunning } = useCountdown((5000 * 10), false, () => { setGameState("game-over") }); // TOOD: Rectify this - used to be 5 * props.numberCards

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
            server.sendMessage(opponent, {type: "EndTurn"});
            setTimerRunning(false);
            setGameState("opponent-turn");

        }, 1000);

        return () => clearTimeout(timeout);

    }, [gameState, chosenCards, lives, deck, server, opponent, setTimerRunning]);

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
                    setTimeout(() => {

                        if (first.sourceId === second.sourceId) { // Match.
                            first.hidden = true;
                            second.hidden = true;
                        }
                        else { // No match.
                            first.flipped = !first.flipped;
                            second.flipped = !second.flipped;
                        }
                    }, 1000);

                    setChosenCards({first: null, second: null});
                }

                server.setEventMessage(null);
                break;

            case "EndTurn":
                setTimerRunning(true);
                setGameState("await-card-1");
                server.setEventMessage(null);

            break;

            case "GameOver":

                

                // TODO: Show score screen etc.

                server.setEventMessage(null);
                break;
        
            default:
                break;
        }

    }, [gameState, server, deck, chosenCards, setTimerRunning]);

    // Handle game state: game-over
    useEffect(() => {
        if (gameState !== "game-over") return;

        setTimerRunning(false);
        server.sendMessage(opponent, {type: "GameOver", score, lives, timer});

        if (server.eventMessage) {
            let event = server.eventMessage;

            let myGameStats = {score, lives, timer};
            let opponentGameStats = {score: event.score, lives: event.lives, timer: event.timer};

            endGameCallback(myGameStats, opponentGameStats);
            setMultiplayerState("show-score");
        }

        
        // TODO: Show score etc.

    }, [gameState, setTimerRunning, setMultiplayerState, score, lives, timer, server, opponent, endGameCallback]);

    // Callback to handle card click.
    const handleCardClick = useCallback(id => {
        if (gameState !== "await-card-1" && gameState !== "await-card-2") return;
        if (chosenCards.first && chosenCards.first.id === id) return;

        let card = deck.find(card => card.id === id);

        // Flip card.
        card.flipped = !card.flipped;

        // Send card id to opponent.
        server.sendMessage(opponent, {type: "CardFlip", cardId: id});

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
                {/* <button
                    disabled={gameState === "opponent-turn"}
                    onClick={() => { setGameState("await-card-1") }}>
                    gib turn pls
                </button> */}
                <ChatWindow opponent={opponent}/>
            </div>
        </div>
    )
}

export default MultiGame;