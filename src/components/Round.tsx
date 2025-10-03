import { useState } from "react";
import { Match, type MatchType } from "./Match";

type RoundProps = {
  matches: MatchType[];
  onResultsSubmit: (
    matches: (MatchType & { homeGoals: number; awayGoals: number })[]
  ) => void;
};

export const Round = ({ matches, onResultsSubmit }: RoundProps) => {
  const [matchResults, setMatchResults] = useState<{
    [key: number]: { homeGoals: number; awayGoals: number };
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateMatchResult = (
    matchIndex: number,
    homeGoals: number,
    awayGoals: number
  ) => {
    if (!isSubmitted) {
      setMatchResults((prev) => ({
        ...prev,
        [matchIndex]: { homeGoals, awayGoals },
      }));
    }
  };

  const registerResults = () => {
    if (isSubmitted) return;
    const matchesWithResults = matches.map((match, index) => ({
      ...match,
      homeGoals: matchResults[index]?.homeGoals || 0,
      awayGoals: matchResults[index]?.awayGoals || 0,
    }));
    onResultsSubmit(matchesWithResults);
    setIsSubmitted(true);
  };

  const editResults = () => {
    setIsSubmitted(false);
  };

  const hasResults = Object.keys(matchResults).length > 0;

  return (
    <div>
      <ul className="round-container">
        {matches.map((match, index) => (
          <li key={index}>
            <Match
              match={match}
              onGoalsChange={(home, away) =>
                updateMatchResult(index, home, away)
              }
              homeGoals={matchResults[index]?.homeGoals || 0}
              awayGoals={matchResults[index]?.awayGoals || 0}
            />
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {!isSubmitted ? (
          <button
            onClick={registerResults}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
            }}
          >
            {" "}
            {matches.length > 1 ? "Registrer resultater" : "Registrer resultat"}
          </button>
        ) : (
          <>
            <button
              onClick={editResults}
              style={{ backgroundColor: "#3b2300", color: "white" }}
            >
              {matches.length > 1 ? "Endre resultater" : "Endre resultat"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
