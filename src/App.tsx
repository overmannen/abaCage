import { useState, useRef, useCallback, useEffect } from "react";
import { Table } from "./components/Table";
import { Rounds } from "./components/Rounds";
import type { MatchType } from "./components/Match";
import { Logo } from "./components/Logo";
import {
  useLocalStorage,
  saveToStorage,
  loadFromStorage,
} from "./localStorageLogic";

export type PlayerType = {
  name: string;
  score: number;
  matchesPlayed: number;
};

type ProcessedRound = {
  roundId: string;
  matches: (MatchType & { homeGoals: number; awayGoals: number })[];
  pointsAwarded: { [playerName: string]: number };
};

const STORAGE_KEYS = {
  PLAYERS: "tournemant_players",
  PROCESSED_ROUNDS: "tournement_processed_rounds",
};

function App() {
  const [players, setPlayers] = useLocalStorage<PlayerType[]>(
    STORAGE_KEYS.PLAYERS,
    []
  );
  const [newPlayer, setNewPlayer] = useState<string | null>(null);
  const [numberOfPitches, setNumberOfPitches] = useState(1);
  const [resetRounds, setResetRounds] = useState(false);

  const processedRounds = useRef<Map<string, ProcessedRound>>(
    new Map(loadFromStorage(STORAGE_KEYS.PROCESSED_ROUNDS, []))
  );

  const handleInputChangePlayer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlayer(e.target.value);
  };

  const removePlayer = (player: PlayerType) => {
    setPlayers((prev) => prev.filter((p) => p !== player));
  };

  const handleInputChangePitches = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfPitches(Number(e.target.value));
  };

  const addPlayer = () => {
    if (!newPlayer) return;
    setPlayers((prev) => [
      ...prev,
      { name: newPlayer, score: 0, matchesPlayed: 0 },
    ]);
    setNewPlayer("");
  };

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PLAYERS, players);
  }, [players]);

  const saveProcessedRounds = useCallback(() => {
    const roundsArray = Array.from(processedRounds.current.entries());
    saveToStorage(STORAGE_KEYS.PROCESSED_ROUNDS, roundsArray);
  }, []);

  //Må finne ut hvorfor denne legger til 2 ganger, lol
  const calculatePoints = (
    matches: (MatchType & { homeGoals: number; awayGoals: number })[]
  ) => {
    const pointsAwarded: { [playerName: string]: number } = {};
    const matchesPlayed: { [playerName: string]: number } = {};

    matches.forEach((match) => {
      if (match.homeGoals > match.awayGoals) {
        // Hjemmelag vinner
        const teamPlayers = match.homeTeam.split("&");
        teamPlayers.forEach((playerName) => {
          const name = playerName.trim();
          pointsAwarded[name] = (pointsAwarded[name] || 0) + 1.5;
          matchesPlayed[name] = (matchesPlayed[name] || 0) + 0.5;
        });
      } else if (match.homeGoals < match.awayGoals) {
        // Bortelag vinner
        const teamPlayers = match.awayTeam.split("&");
        teamPlayers.forEach((playerName) => {
          const name = playerName.trim();
          pointsAwarded[name] = (pointsAwarded[name] || 0) + 1.5;
          matchesPlayed[name] = (matchesPlayed[name] || 0) + 0.5;
        });
      } else {
        // Uavgjort
        const allPlayers = match.awayTeam
          .split("&")
          .concat(match.homeTeam.split("&"));
        allPlayers.forEach((playerName) => {
          const name = playerName.trim();
          pointsAwarded[name] = (pointsAwarded[name] || 0) + 0.5;
          matchesPlayed[name] = (matchesPlayed[name] || 0) + 0.5;
        });
      }
    });

    return pointsAwarded;
  };

  const updatePlayerScores = useCallback(
    (matches: (MatchType & { homeGoals: number; awayGoals: number })[]) => {
      const baseRoundId = matches
        .map((m) => `${m.homeTeam}-${m.awayTeam}`)
        .join("|");

      const fullRoundId = matches
        .map((m) => `${m.homeTeam}-${m.awayTeam}-${m.homeGoals}-${m.awayGoals}`)
        .join("|");

      if (processedRounds.current.has(fullRoundId)) {
        console.log("Exact same results already processed, skipping");
        return;
      }

      const existingRound = Array.from(processedRounds.current.values()).find(
        (round) =>
          round.roundId.startsWith(
            baseRoundId.split("-").slice(0, -1).join("-")
          )
      );

      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers];

        //Fjerne gamle poeng
        if (existingRound) {
          Object.entries(existingRound.pointsAwarded).forEach(
            ([playerName, points]) => {
              const playerIndex = updatedPlayers.findIndex(
                (p) => p.name === playerName
              );
              if (playerIndex !== -1) {
                updatedPlayers[playerIndex].score -= points;
              }
            }
          );
          processedRounds.current.delete(existingRound.roundId);
        }

        const pointsAwarded = calculatePoints(matches);

        //Nye poeng
        Object.entries(pointsAwarded).forEach(([playerName, points]) => {
          const playerIndex = updatedPlayers.findIndex(
            (p) => p.name === playerName
          );
          if (playerIndex !== -1) {
            updatedPlayers[playerIndex].score += points;
          }
        });

        processedRounds.current.set(fullRoundId, {
          roundId: fullRoundId,
          matches: matches,
          pointsAwarded: pointsAwarded,
        });
        saveProcessedRounds();

        return updatedPlayers;
      });
    },
    [saveProcessedRounds]
  );

  const resetAllScores = () => {
    if (
      window.confirm(
        "Er du sikker på at du vil slette alle poengene og kampene?"
      )
    ) {
      setResetRounds(true);
      processedRounds.current.clear();
      setPlayers((prev) => prev.map((player) => ({ ...player, score: 0 })));
      localStorage.removeItem(STORAGE_KEYS.PROCESSED_ROUNDS);
    }
  };

  useEffect(() => {
    setResetRounds(false);
  }, [resetRounds]);

  const resetAllData = () => {
    if (window.confirm("Er du sikker på at du vil slette all data?")) {
      processedRounds.current.clear();
      setResetRounds(true);
      setPlayers([]);
      setNewPlayer("");
      localStorage.removeItem(STORAGE_KEYS.PLAYERS);
      localStorage.removeItem(STORAGE_KEYS.PROCESSED_ROUNDS);
    }
  };

  return (
    <div className="container">
      <div className="settings-container">
        <input
          id="new-player"
          type="text"
          onChange={handleInputChangePlayer}
          value={newPlayer ? newPlayer : ""}
        />
        <button onClick={addPlayer}>Legg til spiller</button>
        <label htmlFor="number-of-pitches">Antall baner</label>
        <input
          type="number"
          value={numberOfPitches}
          onChange={handleInputChangePitches}
          id="number-of-pitches"
        />
        <button
          onClick={resetAllScores}
          style={{
            marginLeft: "10px",
            backgroundColor: "#f6837b",
            color: "white",
          }}
        >
          Nullstill poeng og kamper
        </button>
        <button
          onClick={resetAllData}
          style={{
            marginLeft: "10px",
            backgroundColor: "#f44336",
            color: "white",
          }}
        >
          Slett alt
        </button>
      </div>
      <Logo />
      <Table players={players} removePlayer={removePlayer} />
      <Rounds
        players={players}
        numOfPitches={numberOfPitches}
        onResultsRegistered={updatePlayerScores}
        resetRounds={resetRounds}
      />
    </div>
  );
}

export default App;
