import React, { useEffect, useState, useCallback, useContext } from "react"
import useRandomizedDeck from "./customhooks/useRandomizedDeck"
import useCountdown from "./customhooks/useCountdown"
import Sidebar from "./Sidebar"
import CardContainer from "./CardContainer"
import ChatWindow from "./ChatWindow"
import { ServerContext } from "./ServerContext"

function MultiGame(props) {
    const server = useContext(ServerContext);

    // A deck of card pairs, size specified by props.
    const { deck, setDeck } = useRandomizedDeck();

    // The cards that player has chosen to flip.
    const [chosenCards, setChosenCards] = useState({ first: null, second: null });

    // The current game state: init, await-card-1, await-card-2, process-choice, opponent-turn, game-over
    const [gameState, setGameState] = useState("init");

    // The current score from matching cards.
    const [score, setScore] = useState(0);

    // The number of remaining lives.
    const [lives, setLives] = useState(5);

    // A coundown providing the remaining time.
    const { timer, setRunning: setTimerRunning } = useCountdown((500 * props.numberCards), false, () => { setGameState("game-over") });

    // Handle game state: init
    useEffect(() => {
        if (gameState !== "init") return;

        console.log(props.deck);

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
                setTimerRunning(true);
                setGameState(props.firstMove ? "await-card-1" : "opponent-turn");
            }, 1500);
        }, 500);

        return () => clearTimeout(timeout);

    }, [gameState, setDeck, setTimerRunning, props]);

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
            setGameState("opponent-turn");

        }, 1000);

        return () => clearTimeout(timeout);

    }, [gameState, chosenCards, deck, lives]);

    // Handle game state: opponent-turn
    useEffect(() => {
        if (gameState !== "opponent-turn") return;
    }, [gameState]);

    // Handle game state: game-over
    useEffect(() => {
        if (gameState !== "game-over") return;

        setTimerRunning(false);
        // TODO: Show score etc.
        props.setMultiplayerState("show-score");

    }, [gameState, setTimerRunning, props, score, lives, timer]);

    // Callback to handle card click.
    const handleCardClick = useCallback(id => {
        if (gameState !== "await-card-1" && gameState !== "await-card-2") return;
        if (chosenCards.first && chosenCards.first.id === id) return;

        let card = deck.find(card => card.id === id);

        // Flip card.
        card.flipped = !card.flipped;

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

    }, [gameState, chosenCards, deck])

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
                <ChatWindow opponent={props.opponent}/>
            </div>
        </div>
    )
}

export default MultiGame;