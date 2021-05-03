import React, { useState } from "react"

function StartScreen(props) {
    const [selectInput, setSelectInput] = useState(2);

    function handleChangeSelect(event) {
        setSelectInput(event.target.value);
    }

    function handleClickStart() {
        props.setPlayingGame(true)
        props.setNumberCardsCallback(selectInput);
    }

    return(
        <>
            <div id="start-screen">
                <button onClick={handleClickStart} >
                    Start Game!
                </button>
                <br />
                <label>Select number of cards: </label>
                <select id="select-number-cards" value={selectInput} onChange={handleChangeSelect}>
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
                <br />
                <button>
                    MultiPlayer!
                </button>
            </div>
        </>
    );
}

export default StartScreen;