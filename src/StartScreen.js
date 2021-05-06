import React, { useContext, useState } from "react"
import { ThemeContext } from "./ThemeContext";

function StartScreen(props) {
    const theme = useContext(ThemeContext);
    const [selectInput, setSelectInput] = useState(10);

    function handleChangeSelect(event) {
        setSelectInput(event.target.value);
    }

    function handleClickStart() {
        props.setActiveScreen("single");
        props.setNumberCardsCallback(selectInput);
    }

    return (

        <div id="start-screen" style={{ backgroundColor: theme.backgroundSub }}>
            <button onClick={handleClickStart} >
                Start Game!
                </button>
            <div id="number-cards-select">
                <label>Select number of cards: </label>
                <br />
                <select value={selectInput} onChange={handleChangeSelect}>
                    <option>2</option>
                    <option>4</option>
                    <option>6</option>
                    <option>8</option>
                    <option>10</option>
                    <option>12</option>
                    <option>14</option>
                    <option>16</option>
                    <option>18</option>
                    <option>20</option>
                    <option>104</option>
                </select>
            </div>
            <button>
                MultiPlayer!
                </button>
        </div>

    );
}

export default StartScreen;