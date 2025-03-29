import React, { useEffect, useState } from "react";


// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random values in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: ` takes ${damage} damages`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: ` heal ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [specialIndex, setSpecialIndex] = useState(0);
  const [isHealed, setIsHealed] = useState(false);
  const [battleLog, setBattleLog] = useState([]);
  const [isWining, setIsWining] = useState(false);
  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  // attack button
  function attack() {
    let playerDamage = getRandomValue(5, 12);
    let monsterDamage = getRandomValue(5, 15);


    setPlayerHealth((prevHealth) => {
      const newHealth = Math.max(prevHealth - monsterDamage, 0);
      if (newHealth === 0) {
        setGameOver(true);
        setIsWining(false);
      }
      return newHealth;
    });

    setMonsterHealth((prevHealth) => {
      const newHealth = Math.max(prevHealth - playerDamage, 0);
      if (newHealth === 0) {
        setGameOver(true);
        setIsWining(true);
      }
      return newHealth;
    });
    
    
    setBattleLog( (prevLog) => [createLogAttack(false, playerDamage), ...prevLog] );
    setBattleLog( (prevLog) => [createLogAttack(true, monsterDamage), ...prevLog] );
    setSpecialIndex((prevIndex) => prevIndex + 1);
  }

  // Kill yourself button

  function killYourSelf() {
    setPlayerHealth(0);
    setGameOver(true);
    setIsWining(false);
  }

  // Heal

  function heal() {
    let healPoints = getRandomValue(5, 18);
    setPlayerHealth((prevHealth) =>
      Math.min(prevHealth + healPoints, 100)
    );
    setBattleLog( (prevLog) => [createLogHeal(healPoints), ...prevLog]);
    setIsHealed(true);
  }

  // Special

  useEffect(() => {
    if(specialIndex === 3) {
      setIsSpecial(true);
    }
  }, [specialIndex])


// Special Skill button
  function specialSkill() {
    if (isSpecial) {
      let playerDamage = getRandomValue(8, 25);
      setMonsterHealth((prevHealth) => {
      const newHealth = Math.max(prevHealth - playerDamage, 0);
      setBattleLog( (prevLog) => [...prevLog, createLogAttack(true, playerDamage)] );
        if (newHealth === 0) {
          setGameOver(true);
          setIsWining(true);
        }
        return newHealth;
      });
      setIsSpecial(false);
    }
  }

  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------


  function monsterHealthBar() {
    return {
      width: `${monsterHealth}%`,
    };
  }

  function playerHealthBar() {
    return {
      width: `${playerHealth}%`,
    };
  }

  function isGameOver() {
    if (gameOver) {
      return {
        display: "block",
      };
    } else {
      return { display: "none" };
    }
  }


  function newGame() {
    setGameOver(false);
    setIsHealed(false);
    setIsSpecial(false);
    setMonsterHealth(100);
    setPlayerHealth(100);
    setSpecialIndex(0);
    setBattleLog([]);
  }
  // ----------------------------------------------------------------------------------------------------------
  // MAIN  TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      <section class="container">
        <h2>Monster Health ({monsterHealth})</h2>
        <div class="healthbar">
          <div style={monsterHealthBar()} class="healthbar__value"></div>
        </div>
      </section>
      <section class="container">
        <h2>Your Health ({playerHealth})</h2>
        <div class="healthbar">
          <div style={playerHealthBar()} class="healthbar__value"></div>
        </div>
      </section>
      <section style={isGameOver()} class="container">
        <h2>Game Over!</h2>
        <div className={isWining ? "win" : "lose"}>
          <h3>{isWining ? "You Win!" : "You Lose!"}</h3>
        </div>
        <button onClick={newGame}>Start New Game</button>
      </section>
      <section id="controls">
        <button 
        onClick={attack} 
        disabled={gameOver}>
          ATTACK
        </button>

        <button
          onClick={specialSkill}
          disabled={gameOver || !isSpecial}
        >
          SPECIAL !
        </button>

        <button 
        disabled={gameOver || isHealed} 
        onClick={heal}>
          HEAL
        </button>

        <button 
        onClick={killYourSelf}
        disabled={gameOver}>
          KILL YOURSELF
        </button>
      </section>
      <section id="log" class="container">
        <h2>Battle Log</h2>
        <ul>
          {battleLog.map((log, index) => (
           <li key={index}>
            <span className={log.isPlayer ? "log--player" : "log--monster"}>{log.isPlayer ? "Player" : "Monster"}</span> <span className={log.isDamage ? "log--damage" : "log--heal"}>{log.text}</span>
           </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Game;
