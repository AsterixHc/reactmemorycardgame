function useRandomizedDeck(numberOfCards) {
    let cardSources = [
        "./cards/2C.png", "./cards/2D.png", "./cards/2H.png", "./cards/2S.png",
        "./cards/3C.png", "./cards/3D.png", "./cards/3H.png", "./cards/3S.png",
        "./cards/4C.png", "./cards/4D.png", "./cards/4H.png", "./cards/4S.png",
        "./cards/5C.png", "./cards/5D.png", "./cards/5H.png", "./cards/5S.png",
        "./cards/6C.png", "./cards/6D.png", "./cards/6H.png", "./cards/6S.png",
        "./cards/7C.png", "./cards/7D.png", "./cards/7H.png", "./cards/7S.png",
        "./cards/8C.png", "./cards/8D.png", "./cards/8H.png", "./cards/8S.png",
        "./cards/9C.png", "./cards/9D.png", "./cards/9H.png", "./cards/9S.png",
        "./cards/10C.png", "./cards/10D.png", "./cards/10H.png", "./cards/10S.png",
        "./cards/AC.png", "./cards/AD.png", "./cards/AH.png", "./cards/AS.png",
        "./cards/JC.png", "./cards/JD.png", "./cards/JH.png", "./cards/JS.png",
        "./cards/KC.png", "./cards/KD.png", "./cards/KH.png", "./cards/KS.png",
        "./cards/QC.png", "./cards/QD.png", "./cards/QH.png", "./cards/QS.png"
    ]; // TODO: Use for-loop(s) to construct source strings & populate array (maybe rename files)

    let deck = [];

    for (let i = 0; i < numberOfCards; i=i+2) {

        let randomIndex = Math.floor(Math.random()*cardSources.length);
        let cardSource = cardSources.splice(randomIndex, 1);

        deck.push({id: i, source: cardSource, flipped: false, hidden: false});
        deck.push({id: i+1, source: cardSource, flipped: false, hidden: false});
    }

    deck = shuffleArray(deck);

    return deck;
}

// Shuffle algorithm credit: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
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

export default useRandomizedDeck;