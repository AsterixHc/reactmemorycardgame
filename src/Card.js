import React, {useContext, useState} from "react"
import { ThemeContext } from "./Theme"

function Card(props){
    const lookingTheme = useContext(ThemeContext);
    const [cardImage, setCardImage] = useState(lookingTheme.background);

    function flipCard()
    {
        //A big if + if else statement
        setCardImage( cardImage === lookingTheme.background ? lookingTheme.foreground : lookingTheme.background);
    }
    return(
        <>
            {/* <h1>Bob the builder man</h1>
            <div onClick={changeTheme} style={{height:250,width:150, backgroundColor: cardImage}}> */}

            {/* </div> */}

            <img className = "cardImage" onClick={flipCard} alt="" src={cardImage} />
        </>
    );
}
export default Card

