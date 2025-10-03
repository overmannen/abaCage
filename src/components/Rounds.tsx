import { useEffect, useState } from "react";
import type { MatchType } from "./Match";
import { Round } from "./Round";
import type { PlayerType } from "../App";
import { createRoundPitches, createRoundTeams } from "../APICalls";

type RoundsProps = {
  players: PlayerType[];
  onResultsRegistered: (
    matches: (MatchType & { homeGoals: number; awayGoals: number })[]
  ) => void;
  resetRounds: boolean;
  roundSetting: string;
  numOfTeams: number;
  numOfPitches: number;
};

type RoundType = {
  matches: MatchType[];
};

export const Rounds = ({
  players,
  onResultsRegistered,
  resetRounds,
  roundSetting,
  numOfTeams,
  numOfPitches,
}: RoundsProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rounds, setRounds] = useState<RoundType[]>([]);

  const generateRound = async () => {
    if (players.length < 2) {
      setError("You need two players");
      return;
    }
    if (roundSetting !== "pitches" && roundSetting !== "teams") {
      setError("Error in option selection");
      return;
    }
    if (roundSetting === "pitches" && numOfPitches < 1) {
      setError("You need one pitch");
      return;
    }
    if (roundSetting === "teams" && numOfTeams < 2) {
      setError("You need two teams");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const matches =
        roundSetting === "pitches"
          ? await createRoundPitches(players, numOfPitches)
          : await createRoundTeams(players, numOfTeams);
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
