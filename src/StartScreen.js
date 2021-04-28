import React from "react"

function StartScreen(props) {

    function handleClick()
    {
        props.changeStartGame(true);
    }

    return(
        <>
            <div>
                <button onClick={handleClick} >
                    Start Game!
                </button>
                <button>
                    MultiPlayer!
                </button>
            </div>
        </>
    );
}

export default StartScreen;