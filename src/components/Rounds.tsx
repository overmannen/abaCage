import { useEffect, useState } from "react";
import type { MatchType } from "./Match";
import { Round } from "./Round";
import type { PlayerType } from "../App";
import { API_BASE_URL } from "../config";

type RoundsProps = {
  players: PlayerType[];
  numOfPitches: number;
  onResultsRegistered: (
    matches: (MatchType & { homeGoals: number; awayGoals: number })[]
  ) => void;
  resetRounds: boolean;
};

type RoundType = {
  matches: MatchType[];
};

const createRound = async (players: PlayerType[], numOfPitches: number) => {
  try {
    const playerNames = players.map((player) => player.name);
    const requestData = {
      players: playerNames,
      numOfPitches: numOfPitches,
    };

    const response = await fetch(`${API_BASE_URL}/create-round/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "error") {
      throw new Error(result.message);
    }

    return result.data.round;
  } catch (error) {
    console.error("Error with creation of round:", error);
    throw error;
  }
};

export const Rounds = ({
  players,
  numOfPitches,
  onResultsRegistered,
  resetRounds,
}: RoundsProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rounds, setRounds] = useState<RoundType[]>([]);

  const generateRound = async () => {
    if (players.length < 2) {
      setError("You need two players");
      return;
    }
    if (numOfPitches < 1) {
      setError("You need one pitch");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const matches = await createRound(players, numOfPitches);
      setRounds((round) => [...round, matches]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not make matches, check if API-server is running"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resetRounds) {
      setRounds([]);
    }
  }, [resetRounds]);

  const handleResultsFromRound = (
    matches: (MatchType & { homeGoals: number; awayGoals: number })[]
  ) => {
    onResultsRegistered(matches);
  };

  return (
    <div className="rounds-container">
      <h2>Kamper</h2>
      <button onClick={generateRound} disabled={isLoading}>
        {isLoading ? "Laster..." : "Lag ny runde"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {rounds.map((round, index) => (
          <li key={index}>
            <p>Runde {index + 1}</p>
            <Round
              matches={round.matches}
              onResultsSubmit={handleResultsFromRound}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
