import './App.css';
import { useState, useEffect } from 'react';
import { ref, update, onValue } from 'firebase/database';
import realtime from './firebase.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

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

  const resetPlayers = () => {
    const specificNodeRef = ref(realtime, "players");
    update(specificNodeRef, { playerOneReady: false, playerTwoReady: false });
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
    <Router>
      <div className="App">
        <Route exact path="/">

          <div className="playerControls">

            <div className="playerOne">
              <p>
                {playersReady.playerOneReady ? "Player 1 Ready" : "Awaiting Player 1"}
              </p>
              <Link to="/player1">
                <button className="playerOneButton" onClick={() => handleClick(0)}>
                  {playersReady.playerOneReady ? "Ready" : "Player 1"}
                </button>

              </Link>

            </div>
          </div>


          <div className="playerTwo">
            <p>
              {playersReady.playerTwoReady ? "Player 2 Ready" : "Awaiting Player 2"}
            </p>
            <Link to="/player2">
              <button className="playerTwoButton" onClick={() => handleClick(1)}>
                {playersReady.playerTwoReady ? "Ready" : "Player 2"}
              </button>
            </Link>
          </div>

          {
            playersReady.playerOneReady && playersReady.playerTwoReady ?
              <p>Both players ready</p> : null
          }
          <button onClick={resetPlayers}>Reset Players</button>

        </Route>
        <Route path="/player1">
          <p>Player 1 Ready - Awaiting Player 2</p>
        </Route>

        <Route path="/player2">
          <p>Player 2 Ready - Awaiting Player 1</p>
        </Route>
      </div>


    </Router >
  );
}

export default App;
