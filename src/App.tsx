import { useState, useMemo, useEffect } from "react";
import { Table } from "./components/Table";
import { Logo } from "./components/Logo";
import { createRound } from "./modules/roundGenerator";
import { useLocalStorage } from "./modules/localStorageLogic";
import { Timer } from "./components/Timer";

export type PlayerType = {
  name: string;
  score: number;
  matchesPlayed: number;
  goalDifference: number;
};
export type MatchType = {
  homeTeam: TeamType;
  awayTeam: TeamType;
  homeGoals: number;
  awayGoals: number;
  matchIndex: number;
  roundNumber: number;
};

export type RoundType = {
  matches: MatchType[];
};

export type TeamType = {
  players: PlayerType[];
};

const STORAGE_KEYS = {
  PLAYERS: "players",
  ROUNDS: "rounds",
};

function App() {
  const [newPlayer, setNewPlayer] = useState("");
  const [players, setPlayers] = useLocalStorage<PlayerType[]>(
    STORAGE_KEYS.PLAYERS,
    [],
  );

  const [numberOfPitches, setNumberOfPitches] = useState(1);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [isPitches, setIsPitches] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [rounds, setRounds] = useLocalStorage<RoundType[]>(
    STORAGE_KEYS.ROUNDS,
    [],
  );

  const addPlayer = () => {
    if (!newPlayer.trim()) return;
    if (players.find((p) => p.name === newPlayer)) {
      setError("Hver spiller må ha unikt navn");
      return;
    }
    setPlayers((prev) => [
      ...prev,
      {
        name: newPlayer.trim(),
        score: 0,
        matchesPlayed: 0,
        goalDifference: 0,
      },
    ]);
    setNewPlayer("");
  };

  const removePlayer = (player: PlayerType) => {
    setPlayers((prev) => prev.filter((p) => p.name !== player.name));
  };

  const resetAllScores = () => {
    if (!window.confirm("Slette alle poeng og runder?")) return;
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        score: 0,
        matchesPlayed: 0,
      })),
    );
    setRounds([]);
  };

  const setRoundSetting = (setting: string) => {
    if (setting === "pitches") {
      setIsPitches(true);
    } else {
      setIsPitches(false);
    }
  };

  const resetAllData = () => {
    if (!window.confirm("Slette all data?")) return;
    setPlayers([]);
    setNewPlayer("");
    setRounds([]);
  };

  const generateRound = () => {
    if (players.length < 2) {
      setError("Du trenger minst 2 spillere");
      return;
    }

    if (numberOfPitches < 1) {
      setError("Du trenger minst 1 bane");
      return;
    }

    setError(null);
    setIsLoading(true);

    const num = isPitches ? numberOfPitches * 2 : numberOfTeams;
    const playersCopy = players.map((p) => ({ ...p }));
    const currentRoundNumber = rounds.length;

    try {
      const newRound = createRound({
        players: playersCopy,
        num,
        roundNumber: currentRoundNumber,
      });
      if (!newRound.error && newRound.matches) {
        const round = {
          matches: newRound.matches,
          roundNumber: currentRoundNumber,
        };
        setRounds((prev) => [...prev, round]);
      } else if (newRound.error) {
        setError(newRound.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke lage kamper");
    } finally {
      setIsLoading(false);
    }
  };

  const copyRound = (roundToCopy: RoundType) => {
    if (players.length < 2) {
      setError("Du trenger minst 2 spillere");
      return;
    }

    if (numberOfPitches < 1) {
      setError("Du trenger minst 1 bane");
      return;
    }

    setError(null);
    setIsLoading(true);

    const currentRoundNumber = rounds.length;

    const newRound: RoundType = {
      matches: roundToCopy.matches.map((m, i) => ({
        ...m,
        homeGoals: 0,
        awayGoals: 0,
        matchIndex: i,
        roundNumber: currentRoundNumber,
      })),
    };

    setRounds((prev) => [...prev, newRound]);
    setIsLoading(false);
  };

  const formatTeam = (team: PlayerType[]) => {
    const teamPlayers = team.map((player) => player.name);
    return teamPlayers.join(" & ");
  };

  const playerScores = useMemo(() => {
    const updatedPlayers = players.map((player) => ({
      ...player,
      score: 0,
      matchesPlayed: 0,
    }));

    rounds.forEach((round) =>
      round.matches.forEach((match) => {
        if (match.homeGoals > match.awayGoals) {
          match.homeTeam.players.forEach((player) => {
            const p = updatedPlayers.find((up) => up.name === player.name);
            if (p) {
              p.score += 3;
              p.matchesPlayed += 1;
              p.goalDifference += match.homeGoals - match.awayGoals;
            }
          });
          match.awayTeam.players.forEach((player) => {
            const p = updatedPlayers.find((up) => up.name === player.name);
            if (p) {
              p.matchesPlayed += 1;
              p.goalDifference += match.awayGoals - match.homeGoals;
            }
          });
        } else if (match.homeGoals < match.awayGoals) {
          match.awayTeam.players.forEach((player) => {
            const p = updatedPlayers.find((up) => up.name === player.name);
            if (p) {
              p.score += 3;
              p.matchesPlayed += 1;
              p.goalDifference += match.awayGoals - match.homeGoals;
            }
          });
          match.homeTeam.players.forEach((player) => {
            const p = updatedPlayers.find((up) => up.name === player.name);
            if (p) {
              p.matchesPlayed += 1;
              p.goalDifference += match.homeGoals - match.awayGoals;
            }
          });
        } else {
          match.awayTeam.players.forEach((player) => {
            const p = updatedPlayers.find((up) => up.name === player.name);
            if (p) {
              p.score += 1;
              p.matchesPlayed += 1;
              p.goalDifference += match.awayGoals - match.homeGoals;
            }
          });
          match.homeTeam.players.forEach((player) => {
            const p = updatedPlayers.find((up) => up.name === player.name);
            if (p) {
              p.score += 1;
              p.matchesPlayed += 1;
              p.goalDifference += match.homeGoals - match.awayGoals;
            }
          });
        }
      }),
    );

    return updatedPlayers;
  }, [players, rounds]);

  useEffect(() => {
    setTimeout(resetError, 3000);
  }, [error]);

  const resetError = () => {
    setError(null);
  };

  const removeRound = (round: RoundType) => {
    setRounds((prev) => prev.filter((r) => r !== round));
  };

  return (
    <div className="container">
      <div className="settings-container">
        <input
          id="new-player"
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
          placeholder="Navn..."
        />
        <button onClick={addPlayer}>Legg til spiller</button>

        <div className="round-settings-container">
          <label htmlFor="pitches">Antall baner</label>
          <input
            id="pitches"
            type="number"
            value={numberOfPitches}
            onChange={(e) =>
              setNumberOfPitches(Math.max(1, Number(e.target.value)))
            }
            min="1"
          />

          <label htmlFor="teams">Antall lag</label>
          <input
            id="teams"
            type="number"
            value={numberOfTeams}
            onChange={(e) =>
              setNumberOfTeams(Math.max(2, Number(e.target.value)))
            }
            min="2"
          />

          <fieldset>
            <legend>Basert på lag eller baner?</legend>
            {(["teams", "pitches"] as const).map((setting) => (
              <div key={setting}>
                <input
                  id={setting}
                  type="radio"
                  name="setting"
                  value={setting}
                  defaultChecked={setting === "teams"}
                  onChange={(e) =>
                    setRoundSetting(e.target.value as "teams" | "pitches")
                  }
                />
                <label htmlFor={setting}>
                  {setting === "teams" ? "Lag" : "Baner"}
                </label>
              </div>
            ))}
          </fieldset>
        </div>

        <button onClick={resetAllScores} style={{ backgroundColor: "#f6837b" }}>
          Nullstill poeng og kamper
        </button>
        <button onClick={resetAllData} style={{ backgroundColor: "#f44336" }}>
          Slett alt
        </button>
        <Timer />
      </div>

      <Logo />
      <Table players={playerScores} removePlayer={removePlayer} />
      <div className="rounds-container">
        <div className="generator-container">
          <button onClick={generateRound} disabled={isLoading}>
            {isLoading ? "Laster..." : "Lag ny runde"}
          </button>
          {error && <div className="error">{error}</div>}
        </div>
        {rounds.map((round, index) => (
          <li key={`round-${index}-${round.matches.length}`}>
            {" "}
            <div className="round-info">
              <h4>Runde {index + 1}</h4>
              <button
                onClick={() => removeRound(round)}
                className="delete-round"
              >
                Slett runde
              </button>
            </div>
            {round.matches.map((match, index) => (
              <div className="match" key={index}>
                <div className="teams">
                  <p
                    className={`home-team ${match.homeGoals > match.awayGoals ? "winning" : ""}`}
                  >
                    {formatTeam(match.homeTeam.players)}
                  </p>
                  <p className="versus">mot</p>
                  <p
                    className={`away-team ${match.homeGoals < match.awayGoals ? "winning" : ""}`}
                  >
                    {formatTeam(match.awayTeam.players)}:
                  </p>
                </div>
                <div className="goals">
                  <button
                    className="goal-btn"
                    onClick={() => {
                      const newRounds = [...rounds];
                      newRounds[match.roundNumber].matches[
                        match.matchIndex
                      ].homeGoals = Math.max(0, match.homeGoals - 1);
                      setRounds(newRounds);
                    }}
                  >
                    −
                  </button>
                  <span className="goal-score">{match.homeGoals}</span>
                  <button
                    className="goal-btn"
                    onClick={() => {
                      const newRounds = [...rounds];
                      newRounds[match.roundNumber].matches[
                        match.matchIndex
                      ].homeGoals = match.homeGoals + 1;
                      setRounds(newRounds);
                    }}
                  >
                    +
                  </button>

                  <span className="goal-separator">–</span>

                  <button
                    className="goal-btn"
                    onClick={() => {
                      const newRounds = [...rounds];
                      newRounds[match.roundNumber].matches[
                        match.matchIndex
                      ].awayGoals = Math.max(0, match.awayGoals - 1);
                      setRounds(newRounds);
                    }}
                  >
                    −
                  </button>
                  <span className="goal-score">{match.awayGoals}</span>
                  <button
                    className="goal-btn"
                    onClick={() => {
                      const newRounds = [...rounds];
                      newRounds[match.roundNumber].matches[
                        match.matchIndex
                      ].awayGoals = match.awayGoals + 1;
                      setRounds(newRounds);
                    }}
                  >
                    +
                  </button>
                </div>
                <button onClick={() => copyRound(round)}>Kopier runde</button>
              </div>
            ))}
          </li>
        ))}
      </div>
    </div>
  );
}

export default App;
