import React, {useContext, useEffect, useState} from "react"
import { ThemeContext } from "./Theme"

function Card(props){
    const lookingTheme = useContext(ThemeContext);
    const [frontImage, setFrontImage] = useState(props.frontImage);
    const [backImage, setBackImage] = useState(lookingTheme.background);

    function handleClick() {
        props.handleClick(props.id);
    }

    useEffect(() => {
        setFrontImage(props.frontImage);
    },[props.frontImage]);
    
    return(
        <>
            <div className={"card" + (props.flipped ? " flip" : "") + (props.hidden ? " hide" : "")} onClick={handleClick}>
                <div className="card-front">
                    <img alt="" src={frontImage} style={{width: 200}}></img>
                </div>
                <div className="card-back">
                    <img alt="" src={backImage} style={{width: 200}}></img>
                </div>
            </div>
        </>
    );
}
export default Card