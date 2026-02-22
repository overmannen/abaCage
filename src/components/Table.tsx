import type { PlayerType } from "../App";

type TableProps = {
  players: PlayerType[];
  removePlayer: (player: PlayerType) => void;
};

export const Table = ({ players, removePlayer }: TableProps) => {
  const sortedPlayers = [...players].sort(
    (a, b) => b.score - a.score || b.goalDifference - a.goalDifference,
  );

  return (
    <div className="table-container">
      <h2>Tabell</h2>
      <table>
        <thead>
          <tr>
            <th>Plass</th>
            <th>S</th>
            <th>P</th>
            <th>SK</th>
            <th>MF</th>
            <th>{""}</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.name} className="table-row">
              <td>{index + 1}.</td>
              <td>{player.name}</td>
              <td key={`score-${player.score}`} className="score-changed">
                {player.score}
              </td>
              <td key={`matches-${player.matchesPlayed}`}>
                {player.matchesPlayed}
              </td>
              <td key={`gd-${player.goalDifference}`} className="score-changed">
                {player.goalDifference}
              </td>
              <td>
                <button onClick={() => removePlayer(player)}>
                  Slett spiller
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
