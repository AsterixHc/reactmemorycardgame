import React, { useEffect, useState, useCallback } from "react"
import useRandomizedDeck from "./useRandomizedDeck"
import useCountdown from "./useCountdown"
import Sidebar from "./Sidebar"
import Score from './Score';
import CardContainer from "./CardContainer"

function Game(props) {
    // A deck of card pairs to be used in the game.
    const { deck, setDeck } = useRandomizedDeck(props.numberCards);

    // The cards that player has chosen to flip.
    const [chosenCards, setChosenCards] = useState({ first: null, second: null });

    // The number of remaining lives, used to determine lose condition and final score.
    const [playerLives, setPlayerlives] = useState(5);

    // Callback to handle timer reaching zero.
    const handleTimerZero = useCallback(() => {
        setShowScore(true);
    }, []);

    // The amount of remaining time, used to determine lose condition and final score.
    const { timer, running: timerRunning, start: startTImer, stop: stopTimer } = useCountdown(30, false, handleTimerZero);

    // The player's current score from matchnig cards.
    const [score, setScore] = useState(0);

    //Determines whether the score component is shown
    const [showScore, setShowScore] = useState(false); // TODO: make this better and not ugly

    // At start of game, flip all cards for 2 seconds.
    useEffect(() => {

        let timeout = setTimeout(() => {
            setDeck(prevState => {
                let newState = [...prevState];
                newState.forEach(card => {
                    card.flipped = true;
                });
                return newState;
            });
        }, 500);

        timeout = setTimeout(() => {
            setDeck(prevState => {
                let newState = [...prevState];
                newState.forEach(card => {
                    card.flipped = false;
                });

                startTImer();
                return newState;
            });
        }, 2000);

        return () => {clearTimeout(timeout)};

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    // Card game logic.
    useEffect(() => {
        if (!chosenCards.first || !chosenCards.second) return;

        let first = chosenCards.first;
        let second = chosenCards.second;

        let effectTimeout = setTimeout(() => {
            if (first.sourceId === second.sourceId) { //Chosen cards match.
                setDeck(prevState => {
                    let newState = [...prevState];

                    newState.find(card => card.id === first.id).hidden = true;
                    newState.find(card => card.id === second.id).hidden = true;

                    return newState;
                });

                // Add points for matching.
                setScore(prevState => {
                    return prevState + 100;
                });

                // Check win condition.
                if (deck.every(card => card.hidden === true)) {
                    stopTimer();
                    setShowScore(true);
                }
            }
            else { // Chosen cards do not match.
                setDeck(prevState => {
                    let newState = [...prevState];

                    let card = newState.find(card => card.id === first.id);
                    card.flipped = !card.flipped;

                    card = newState.find(card => card.id === second.id);
                    card.flipped = !card.flipped;

                    return newState;
                });

                // Detract 1 life. Check lose condition.
                setPlayerlives(prevState => {
                    if (prevState === 1) {
                        stopTimer();
                        setShowScore(true);
                    }
                    return prevState - 1;;
                });
            }

            // Reset selected cards in preparation for next round.
            setChosenCards({ first: null, second: null });
        }, 1000);

        return () => clearTimeout(effectTimeout);

    }, [chosenCards, deck, setDeck, stopTimer]);

    // Callback to handle card click.
    const handleCardClick = useCallback(id => {
        if (!timerRunning) return;
        if (chosenCards.first && chosenCards.second) return;
        if (chosenCards.first && chosenCards.first.id === id) return;

        let card = deck.find(card => card.id === id);

        if (!chosenCards.first) {
            setChosenCards(prevState => {
                let newState = { ...prevState };
                newState.first = card;
                return newState;
            });
        }
        else {
            setChosenCards(prevState => {
                let newState = { ...prevState };
                newState.second = card;
                return newState;
            });
        }

        setDeck(prevState => {
            let newState = [...prevState];
            card.flipped = !card.flipped;
            return newState;
        });
    }, [chosenCards, deck, setDeck, timerRunning])

    if (showScore) {
        return (
            <Score score={score} timeRemaining={timer} lives={playerLives} />
        );
    }
    else {
        return (
            <>
                <Sidebar score={score} lives={playerLives} timeRemaining={timer} />
                <CardContainer deck={deck} handleCardClick={handleCardClick} />
            </>
        )
    }
}

export default Game;