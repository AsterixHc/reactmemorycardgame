import React, { useContext, useEffect, useState } from "react"
import Card from "./Card"
import {ThemeContext} from "./ThemeContext"
import useRandomizedDeck from "./useRandomizedDeck"

function Game(props){
    const [cardArray, setCardArray] = useState(useRandomizedDeck(10));
    const [chosenCards, setChosenCards] = useState({first: null, second: null});
    const theme = useContext(ThemeContext);

    useEffect(() => {
        let first = chosenCards.first;
        let second = chosenCards.second;

        if (first && second) {
            if (first.source === second.source) {
                // Match.
                setTimeout(() => {
                    hideCard(first.id);
                    hideCard(second.id);
                    setChosenCards({first: null, second: null});
                }, 1000)

                // TODO: Points, etc.
            }
            else {
                // No match.
                setTimeout(() => {
                    flipCard(first.id);
                    flipCard(second.id);
                    setChosenCards({first: null, second: null});
                }, 1000)

                // TODO: Detract tries, etc.
            }
        }
        
    }, [chosenCards]);

    function handleCardClick(id) {
        if (chosenCards.first && chosenCards.second) return;
        if (chosenCards.first && chosenCards.first.id === id) return;

        let card = cardArray.find(card => card.id === id);

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

        flipCard(id);
    }

    function flipCard(id) {
        setCardArray(prevState => {
            let newState = [...prevState];
            let card = newState.find(card => card.id === id);
            card.flipped = !card.flipped;

            return newState;
        });
    }

    function hideCard(id) {
        setCardArray(prevState => {
            let newState = [...prevState];
            let card = newState.find(card => card.id === id);
            card.hidden = true;

            return newState;
        });
    }

    return (
        <>
            <div className="card-container" style={{backgroundColor: theme.backgroundSub}}>
                {cardArray.map((card, i) => {
                    return(
                        <Card
                            frontImage={card.source.toString()}
                            key={card.id}
                            id={card.id}
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