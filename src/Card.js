import React, {useContext, useEffect, useState} from "react"
import { ThemeContext } from "./Theme"

function Card(props){
    const lookingTheme = useContext(ThemeContext);
    const [frontImage, setFrontImage] = useState(props.frontImage);
    const [backImage, setBackImage] = useState(lookingTheme.background);
    const [flipped, setFlipped] = useState(props.flipped);

    function handleClick() {
        props.callback(setFlipped, props.index);
    }
    
    return(
        <>
            <div className={"card" + (flipped ? " flip" : "")} onClick={handleClick}>
                <div className="card-front">
                    <img alt="" hidden={props.hidden} src={frontImage} style={{width: 200}}></img>
                </div>
                <div className="card-back">
                    <img alt="" hidden={props.hidden} src={backImage} style={{width: 200}}></img>
                </div>
            </div>
        </>
    );
}
export default Card