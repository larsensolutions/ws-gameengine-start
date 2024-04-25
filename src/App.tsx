import { useRef, useEffect, useState } from "react";
import { PizzaGame, SquidGame } from "./games";
import { Players } from "./games/pizza/status";
import "./App.scss";
import { GameEngine, GameState } from "./engine";

const synth = window.speechSynthesis;
let voices;
const loadVoices = () => {
  voices = synth.getVoices();
};
// in Google Chrome the voices are not ready on page load
if ("onvoiceschanged" in synth) {
  synth.onvoiceschanged = loadVoices;
} else {
  loadVoices();
}

enum GameTypes {
  PIZZA = "pizza",
  SQUID = "squid",
}

const getNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const speak = (text: string, randomFrom: string[], setReadText: (val: string | undefined) => void, thegame: GameEngine<GameState>) => {
  if ("speechSynthesis" in window) {
    //console.log(voices);
    synth.cancel();
    const choosenVoice = randomFrom[getNumberBetween(0, randomFrom.length - 1)];
    const selectedVoice = voices.find((voice) => voice.name === choosenVoice); //Thomas, Fred, Hattori, Tessa, Organ, Good News
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text; //"OMG and MEGA L O L! You are the winner, and everyone hates you now mother fucker!"; //text;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    synth.speak(utterance);
    utterance.onend = () => {
      setReadText(undefined);
      thegame.start();
    };
    return synth;
  } else {
    // Speech synthesis not supported, handle error
    console.error("Speech synthesis not supported by this browser");
  }
};

function App() {
  const canvas = useRef(null);
  const [thegame, setTheGame] = useState<GameEngine<GameState> | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const [gameType, setGameType] = useState<GameTypes | undefined>(undefined);
  const [state, setState] = useState<GameState | undefined>(undefined);
  const [readText, setReadText] = useState<string | undefined>(undefined);
  const [speechSynthesis, setSpeechSynteseis] = useState<SpeechSynthesis | undefined>(undefined);
  const [audio, setAudio] = useState<HTMLAudioElement | undefined>(undefined);

  useEffect(() => {
    const audio = new Audio("02.mp3");
    audio.volume = 0.4;
    setAudio(audio);

    // Clean up the audio when the component unmounts
    return () => {
      if (audio) {
        audio.pause();
        setAudio(undefined);
      }
    };
  }, []);

  useEffect(() => {
    const onStart = () => {
      setRunning(true);
      if (!readText) {
        audio?.play();
      }
    };
    const onPause = () => {
      setRunning(false);
      audio!.currentTime = 0;
      audio?.pause();
    };

    const onState = (state: GameState) => {
      audio?.pause();
      const winner = state.gamestate === "finished" ? state.pizzaslices.find((pizzaslice) => pizzaslice.options.tickets > 0) : null;
      if (state.gamestate === "spinning") {
        setReadText("Alright, let's spin the wheel!");
        setSpeechSynteseis((old) => {
          old?.cancel();
          return speak("Alright, let's spin the wheel!", ["Thomas", "Hattori", "Cellos", "Organ"], setReadText, thegame!);
        });
      } else if (state.gamestate === "roast_looser") {
        setReadText(`${state.currentLooser?.options.name}, ${state.currentLooser?.roast.insult}`);
        setSpeechSynteseis((old) => {
          old?.cancel();
          return speak(`${state.currentLooser?.options.name}, ${state.currentLooser?.roast.insult}`, [state.currentLooser?.roast.voice], setReadText, thegame!);
        });
      } else if (state.gamestate === "finished") {
        // Trigge hakk i platen på slutten, jippikaiey!!
        setReadText(`${winner.options.name}, OMG and mega LOL! You are the winner, and everyone hates you now, motherfucker!`);
        setSpeechSynteseis((old) => {
          old?.cancel();
          return speak(
            `${winner.options.name}, Oh my GOD and mega L O L! You are the winner, and everyone hates you now, mother fucker!`,
            ["Fred"],
            setReadText,
            thegame!
          );
        });
      }
      setState({ ...state });
      thegame?.pause();
    };

    if (thegame) {
      thegame.events.on("start", onStart);
      thegame.events.on("pause", onPause);
      thegame.events.on("state", onState);
      thegame.start();
      return () => {
        audio?.pause();
        thegame?.destroy();
        setReadText(undefined);
      };
    }
  }, [thegame]);

  useEffect(() => {
    if (canvas.current && gameType) {
      audio?.pause();
      switch (gameType) {
        case GameTypes.PIZZA:
          setTheGame(new PizzaGame(canvas.current));
          break;
        case GameTypes.SQUID:
          setTheGame(new SquidGame(canvas.current));
          break;
        default:
          break;
      }
      return () => audio?.pause();
    }
  }, [canvas, gameType]);

  const startNewGame = (gameType: GameTypes) => () => {
    thegame?.destroy();
    setGameType(gameType);
  };

  return (
    <div>
      {!thegame && (
        <div className='cover'>
          <img height='30%' src='/mongolide_joakim.gif' alt='logo' />
          <h1>Select game</h1>
          <button onClick={startNewGame(GameTypes.PIZZA)}>Pizza Game</button>
          <button onClick={startNewGame(GameTypes.SQUID)}>Squid Game</button>
        </div>
      )}

      <canvas ref={canvas} id='canvas' />

      {readText && <div className='readText'>{readText}</div>}

      {thegame && gameType === GameTypes.PIZZA && state && <Players state={state} />}

      {thegame && (
        <>
          <div className='controls'>
            <button onClick={() => window.location.reload()}>Reset</button>
            {thegame && (
              <>
                <button disabled={running} onClick={() => thegame?.start()}>
                  Resume
                </button>
                <button disabled={!running} onClick={() => thegame?.pause()}>
                  Pause
                </button>
              </>
            )}
            <button disabled={gameType === GameTypes.PIZZA} onClick={startNewGame(GameTypes.PIZZA)}>
              Pizza Game
            </button>
            <button disabled={gameType === GameTypes.SQUID} onClick={startNewGame(GameTypes.SQUID)}>
              Squid Game
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
