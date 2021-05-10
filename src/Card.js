import React, { useContext } from "react"
import { ThemeContext } from "./ThemeContext"

function Card(props) {
    const theme = useContext(ThemeContext);

    function handleClick() {
        props.handleClick(props.id);
    }

    return (
        <div className={"card" + (props.flipped ? " flip" : "") + (props.hidden ? " hide" : "")} onClick={handleClick}>
            <div className="card-front">
                <img
                    alt=""
                    src={
                        theme.name === "online"
                            ? theme.cardSource[props.sourceId]
                            : theme.cardSource + props.sourceId + ".png"
                    }
                />
            </div>
            <div className="card-back">
                <img
                    alt=""
                    src={
                        theme.name === "online"
                            ? theme.cardSource[52]
                            : theme.cardSource + "B.png"
                    }
                />
            </div>
        </div>
    );
}
export default Card