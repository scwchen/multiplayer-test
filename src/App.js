import './App.css';
import { useState, useEffect } from 'react';
import { ref, update, onValue } from 'firebase/database';
import realtime from './firebase.js';

function App() {

  const [playersReady, setPlayersReady] = useState({ playerOneReady: false, playerTwoReady: false });

  const handleClick = (player) => {
    const specificNodeRef = ref(realtime, "players");

    let newPlayersStatus = {};

    if (player === 0) {

      newPlayersStatus = {
        playerOneReady: !playersReady.playerOneReady,
        playerTwoReady: playersReady.playerTwoReady
      };


    } else if (player === 1) {
      newPlayersStatus =
      {
        playerOneReady: playersReady.playerOneReady,
        playerTwoReady: !playersReady.playerTwoReady
      };
    }

    console.log(specificNodeRef);
    // console.log(newPlayersStatus);
    update(specificNodeRef, newPlayersStatus);
    // setPlayersReady()
  };

  useEffect(() => {
    const dbRef = ref(realtime, 'players');
    // We grab a snapshot of our database and use the .val method to parse the JSON object that is our database data out of it
    onValue(dbRef, (snapshot) => {

      const playersStatus = snapshot.val();

      setPlayersReady(playersStatus);

    });

  }, []);

  return (
    <div className="App">
      <div className="playerControls">
        <div className="playerOne">

          <p>
            {playersReady.playerOneReady ? "Player 1 Ready" : "Awaiting Player 1"}
          </p>
          <button className="playerOneButton" onClick={() => handleClick(0)}>
            {playersReady.playerOneReady ? "Ready" : "Player 1"}
          </button>
        </div>
        <div className="playerTwo">
          <p>
            {playersReady.playerTwoReady ? "Player 2 Ready" : "Awaiting Player 2"}
          </p>
          <button className="playerTwoButton" onClick={() => handleClick(1)}>
            {playersReady.playerTwoReady ? "Ready" : "Player 2"}
          </button>
        </div>

        {
          playersReady.playerOneReady && playersReady.playerTwoReady ? 
          <p>Both players ready</p> : null
        }


      </div>
    </div>
  );
}

export default App;
