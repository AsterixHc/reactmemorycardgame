import React, { useEffect, useState } from "react"
import Card from "./Card"
import {ThemeContext, themes} from "./Theme"
import "./game.css"
import useCardPicker from "./useCardPicker"


function App(props){
    // try API call to get theme, if fail, revert to default
    const [cardArray, setCardArray] = useState([
        {id: 0, source: "", flipped: false, hidden: false},
        {id: 1, source: "", flipped: false, hidden: false},
        {id: 2, source: "", flipped: false, hidden: false},
        {id: 3, source: "", flipped: false, hidden: false},
        {id: 4, source: "", flipped: false, hidden: false},
        {id: 5, source: "", flipped: false, hidden: false}
    ]);
    const [chosenCards, setChosenCards] = useState({first: null, second: null});

    const deck = useCardPicker(cardArray.length);

    useEffect(() => {
        setCardArray(prevState => {
            let newState = [...prevState];
            newState.forEach(element => {
                element.source = deck[element.id];
            });
            return newState;
        });
    },[]);

    useEffect(() => {
        let first = chosenCards.first;
        let second = chosenCards.second;

        if (first && second) {
            if (first.source === second.source) {
                // Match.
                console.log("yay");

                setTimeout(() => {
                    hideCard(first.id);
                    hideCard(second.id);
                    setChosenCards({first: null, second: null});
                }, 1000)

                // TODO: Give points, shoot confetti, get hookers etc.
            }
            else {
                // No match.
                console.log("nay");

                setTimeout(() => {
                    flipCard(first.id);
                    flipCard(second.id);
                    setChosenCards({first: null, second: null});
                }, 1000)
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
            <ThemeContext.Provider value = {themes.Theme1}>
                <div className="card-container">
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
            </ThemeContext.Provider>
        </>
    )
}

export default App