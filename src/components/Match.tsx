export type MatchType = {
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
};

type MatchProps = {
  match: MatchType;
  onGoalsChange: (homeGoals: number, awayGoals: number) => void;
  homeGoals: number;
  awayGoals: number;
};

export const Match = ({
  match,
  onGoalsChange,
  homeGoals,
  awayGoals,
}: MatchProps) => {
  const handleHomeGoals = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHomeGoals = Number(e.target.value);
    onGoalsChange(newHomeGoals, awayGoals);
  };

  const handleAwayGoals = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAwayGoals = Number(e.target.value);
    onGoalsChange(homeGoals, newAwayGoals);
  };

  return (
    <div className="match">
      <div className="teams">
        <p className="home-team">{match.homeTeam}</p>
        <p className="versus">mot</p>
        <p className="away-team">{match.awayTeam}:</p>
      </div>
      <div className="goals">
        <input
          type="number"
          name=""
          id="home-goals"
          onChange={handleHomeGoals}
          value={homeGoals}
          min={0}
        />
        -
        <input
          type="number"
          name=""
          id="away-goals"
          onChange={handleAwayGoals}
          value={awayGoals}
          min={0}
        />
      </div>
    </div>
  );
};
