import React, { useContext, useEffect, useState } from "react"
import Card from "./Card"
import Sidebar from "./Sidebar"
import {ThemeContext} from "./ThemeContext"
import useRandomizedDeck from "./useRandomizedDeck"
import Score from './Score';

function Game(props){
    //Says what theme we are using
    const theme = useContext(ThemeContext);

    //Defines whitch card is chosen
    const [chosenCards, setChosenCards] = useState({first: null, second: null});
    
    //Player health score
    const [playerLives, setPlayerlives] = useState(5); //5 HP too little for player to end game
    
    //Number of cards
    const {deck, setDeck} = useRandomizedDeck(10);
    
    //Time for timer in Secounds
    const [timeRemaining, setTimeRemaining] = useState(30); //30s can be playable

    const [timerInterval, setTimerInterval] = useState(null);

    //The player's score
    const [score, setScore] = useState(0);

    //Determines whether the score component is shown
    const [showScoreScreen, setShowScoreScreen] = useState(false);

    //Card game logic
    useEffect(() => {
        if (!chosenCards.first || !chosenCards.second) return;

        let first = chosenCards.first;
        let second = chosenCards.second;

        setTimeout(() => {
            if (first.sourceId === second.sourceId) { //Chosen cards match.
                setDeck(prevState => {
                    let newState = [...prevState];
                    
                    newState.find(card => card.id === first.id).hidden = true;
                    newState.find(card => card.id === second.id).hidden = true;

                    return newState;
                });

                setScore(prevState => {
                    return prevState + 100;
                });

                // If win condition met:
                if (deck.every(card => card.hidden === true)) {
                    clearInterval(timerInterval);
                    setShowScoreScreen(true);
                }
            }
            else { //Chosen cards do not match.
                setDeck(prevState => {
                    let newState = [...prevState];

                    let card = newState.find(card => card.id === first.id);
                    card.flipped = !card.flipped;

                    card = newState.find(card => card.id === second.id);
                    card.flipped = !card.flipped;

                    return newState;
                });
                //Removes players 1 live when cards doesn't match
                setPlayerlives(prevState => {
                    let newState = prevState - 1;
                    return newState;
                });
            }

            setChosenCards({first: null, second: null}); //Sets cards back to null aka not selected
        }, 1000);
        // eslint-disable-next-line
    }, [chosenCards, setDeck]);

    //Loose game condition
    useEffect(() =>{
        if (playerLives <= 0 || timeRemaining <= 0) {
            clearInterval(timerInterval);
            setShowScoreScreen(true);
        }
        // eslint-disable-next-line
    },[playerLives, timeRemaining, props]);

    //Timer for the game
    useEffect(() => {
        let timerId = setInterval(() => {
            setTimeRemaining(prevState => {
                return prevState - 1;
            });
        }, 1000);

        setTimerInterval(timerId);
    },[]);

    //Card comparisson logic
    function handleCardClick(id) {
        if (chosenCards.first && chosenCards.second) return;
        if (chosenCards.first && chosenCards.first.id === id) return;

        let card = deck.find(card => card.id === id);

        if (!chosenCards.first) {
            setChosenCards(prevState => {
                let newState = {...prevState};
                newState.first = card;
                return newState;
            });
        }
        else {
            setChosenCards(prevState => {
                let newState = {...prevState};
                newState.second = card;
                return newState;
            });
        }

        setDeck(prevState => {
            let newState = [...prevState];
            let card = newState.find(card => card.id === id);
            card.flipped = !card.flipped;
            return newState;
        });
    }

    if (showScoreScreen) {
        return(
            <>
                <Score score={score} timeRemaining={timeRemaining} lives={playerLives}/>
            </>
        );
    }
    else {
        return (
            <>
                <Sidebar score={score} lives={playerLives} timeRemaining={timeRemaining}/>
    
                <div className="card-container" style={{backgroundColor: theme.backgroundSub}}>
                    {deck.map((card, i) => {
                        return(
                            <Card
                                key={card.id}
                                id={card.id}
                                sourceId={card.sourceId}
                                flipped={card.flipped}
                                hidden={card.hidden}
                                handleClick={handleCardClick}
                            />
                        );
                    })}
                </div>           
            </>
        )
    }
}

export default Game;