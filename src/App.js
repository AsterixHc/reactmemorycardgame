import React, { useEffect, useState } from "react"
import Card from "./Card"
import {ThemeContext, themes} from "./Theme"
import "./game.css"

function App(props){
    // try API call to get theme, if fail, revert to default
    const [CardArray, setCardArray] = useState([{source: "./Cars/AS.png", flipped: false, hidden: false}, {source: "./Cars/AS.png", flipped: false, hidden: false}, {source: "./Cars/AH.png", flipped: false, hidden: false}, {source: "./Cars/AD.png", flipped: false, hidden: false}]);
    const [chosenCards, setChosenCards] = useState({first: null, second: null});

    useEffect(() => {
        // vores loop logik

        if (chosenCards.first && chosenCards.second) {
            //check match
            if (chosenCards.first.source === chosenCards.second.source) {
                console.log("yay");
                // hide cards.
            }
            else {
                
            }
        }



    }, [chosenCards]);

    function cardCallback(setFlipped, index) {
        // callback for kort til at flippe sig selv
        // CardArray[key] -> gør flipped til true på en eller anden måde
        
        setFlipped(true);

        if (!chosenCards.first) {
            setChosenCards( prevState => {
                let newState = {...prevState};
                newState.first = CardArray[index];
                return newState;
            });
        }
        else if (!chosenCards.second) {
            setChosenCards( prevState => {
                let newState = {...prevState};
                newState.second = CardArray[index];
                return newState;
            });
        }
    }

    //LOOP ->
    // No cards chosen
    // 1 card chosen
    // 2 cards chosen
    // Check:
    //      match -> give points, hide cards
    //      no match -> detract 1 try, flip cards back

    return (
        <>
            <ThemeContext.Provider value = {themes.Theme1}>
                <div className="card-container"> {CardArray.map((element, i) => {
                        return(
                            <Card hidden = {element.hidden} frontImage={element.source.toString()} key={i} index={i} flipped={element.flipped} callback={cardCallback}/>
                        );
                    })}
                </div>
            </ThemeContext.Provider>
        </>
    )
}

export default App