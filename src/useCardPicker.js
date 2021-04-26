import{useEffect, useState} from "react";

function useCardPicker(sizeOfArray) {
    const [possibleCards, setPossibleCards] = useState([
        "./Cars/2C.png",
        "./Cars/2D.png",
        "./Cars/2H.png",
        "./Cars/2S.png",
        "./Cars/3C.png",
        "./Cars/3D.png",
        "./Cars/3H.png",
        "./Cars/3S.png",
        "./Cars/4C.png",
        "./Cars/4D.png",
        "./Cars/4H.png",
        "./Cars/4S.png",
        "./Cars/5C.png",
        "./Cars/5D.png",
        "./Cars/5H.png",
        "./Cars/5S.png",
        "./Cars/6C.png",
        "./Cars/6D.png",
        "./Cars/6H.png",
        "./Cars/6S.png",
        "./Cars/7C.png",
        "./Cars/7D.png",
        "./Cars/7H.png",
        "./Cars/7S.png",
        "./Cars/8C.png",
        "./Cars/8D.png",
        "./Cars/8H.png",
        "./Cars/8S.png",
        "./Cars/9C.png",
        "./Cars/9D.png",
        "./Cars/9H.png",
        "./Cars/9S.png",
        "./Cars/10C.png",
        "./Cars/10D.png",
        "./Cars/10H.png",
        "./Cars/10S.png",
        "./Cars/AC.png",
        "./Cars/AD.png",
        "./Cars/AH.png",
        "./Cars/AS.png",
        "./Cars/JC.png",
        "./Cars/JD.png",
        "./Cars/JH.png",
        "./Cars/JS.png",
        "./Cars/KC.png",
        "./Cars/KD.png",
        "./Cars/KH.png",
        "./Cars/KS.png",
        "./Cars/QC.png",
        "./Cars/QD.png",
        "./Cars/QH.png",
        "./Cars/QS.png"
    ]);

    const [deck, setDeck] = useState([]);

    //possibleCards = shuffleArray(possibleCards);

    useEffect(() => {
        console.log("useeffect run");

        for (let i = 0; i < sizeOfArray; i+2) {
            let temp = possibleCards[i];
    
            setDeck(prevState => {
                let newState = [...prevState];
                newState.push(temp);
                newState.push(temp);
                console.log(temp);
                return newState;
            });
        }
    }, []);

    //deck = shuffleArray(deck);

    return deck;
}

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
    return array;
}

export default useCardPicker;