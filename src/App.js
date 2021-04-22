import React, { useState } from "react"
import Card from "./Card"
import {ThemeContext, themes} from "./Theme"
import "./game.css"


function App(props){
    // try API call to get theme, if fail, revert to default
    const[CardArray, setCardArray] = useState([<Card />, <Card />, <Card />, <Card />]);

    return (
        <>
            <ThemeContext.Provider value = {themes.Theme1}>
                <div className="card-container"> {CardArray} </div>
            </ThemeContext.Provider>
        </>
    )
}

export default App