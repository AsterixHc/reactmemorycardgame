import React, {useContext, useState} from "react"
import { ThemeContext } from "./ThemeContext"

function Card(props){
    const theme = useContext(ThemeContext);
    const [frontImage, setFrontImage] = useState(props.frontImage);
    const [backImage, setBackImage] = useState(theme.cardback);

    function handleClick() {
        props.handleClick(props.id);
    }
    
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