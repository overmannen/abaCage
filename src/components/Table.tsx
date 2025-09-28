import type { PlayerType } from "../App";

type TableProps = {
  players: PlayerType[];
  removePlayer: (player: PlayerType) => void;
};

export const Table = ({ players, removePlayer }: TableProps) => {
  const sortedPlayers = players.sort((a, b) => b.score - a.score);

  return (
    <div className="table-container">
      <table>
        <tr>
          <th>Plass</th>
          <th>Spiller</th>
          <th>Poeng</th>
          <th>Spilte kamper</th>
          <th>{""}</th>
        </tr>
        {sortedPlayers.map((player, index) => (
          <tr>
            <td>{index + 1}.</td>
            <td>{player.name}</td>
            <td>{player.score}</td>
            <td>{player.matchesPlayed}</td>
            <td>
              <button onClick={() => removePlayer(player)}>
                Slett spiller
              </button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};
