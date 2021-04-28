import React, { useContext, useEffect, useState } from "react"
import Card from "./Card"
import Sidebar from "./Sidebar"
import {ThemeContext} from "./ThemeContext"
import useRandomizedDeck from "./useRandomizedDeck"

function Game(props){
    const theme = useContext(ThemeContext);
    const [chosenCards, setChosenCards] = useState({first: null, second: null});
    const [playerLives, setPlayerlives] = useState(5);
    const {deck, setDeck} = useRandomizedDeck(10);

    useEffect(() => {
        if (!chosenCards.first || !chosenCards.second) return;

        let first = chosenCards.first;
        let second = chosenCards.second;

        setTimeout(() => {
            if (first.sourceId === second.sourceId) { // Chosen cards match.
                setDeck(prevState => {
                    let newState = [...prevState];
                    
                    newState.find(card => card.id === first.id).hidden = true;
                    newState.find(card => card.id === second.id).hidden = true;

                    return newState;
                });

                props.callbackScore();
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

                setPlayerlives(prevState => {
                    let newState = prevState - 1;
                    return newState;
                });
            }

            setChosenCards({first: null, second: null});
        }, 1000);
    }, [chosenCards, setDeck, props]);

    useEffect(() =>{
        if (playerLives <= 0) {
            console.log("Game Over");
            //TODO: Lose Condition if lives = 0
            props.lostGame(false);
        }
    },[playerLives, props]);

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

    return (
        <>
            <Sidebar score={props.score} lives={playerLives}/>
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

export default Game;