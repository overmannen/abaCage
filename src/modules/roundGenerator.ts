import type { PlayerType, MatchType, TeamType } from "../App";

type createProps = {
  players: PlayerType[];
  num: number;
  roundNumber: number;
};

//Fisher Yayes alg.
const shuffle = (playerList: PlayerType[]): PlayerType[] => {
  let currentIndex = playerList.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [playerList[currentIndex], playerList[randomIndex]] = [
      playerList[randomIndex],
      playerList[currentIndex],
    ];
  }
  return playerList;
};

export const createRound = ({ players, num, roundNumber }: createProps) => {
  if (num < 2 || players.length < 2) {
    return { error: "Trenger minst to spillere" };
  }

  if (num > players.length) {
    return { error: "Kan ikke ha flere lag enn spillere" };
  }

  const matches: MatchType[] = [];
  const teams: TeamType[] = [];
  const shuffled = shuffle(players);

  for (let i = 0; i < num; i++) {
    const emptyTeam: TeamType = { players: [] };
    teams.push(emptyTeam);
  }

  let teamIndex = 0;
  for (const player of shuffled) {
    teams[teamIndex].players.push(player);
    teamIndex = (teamIndex + 1) % num;
  }

  let matchIndex = 0;
  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      const homeTeam: TeamType = teams[i];
      const awayTeam: TeamType = teams[j];
      const match: MatchType = {
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeGoals: 0,
        awayGoals: 0,
        matchIndex: matchIndex,
        roundNumber: roundNumber,
      };
      matches.push(match);
      matchIndex += 1;
    }
  }
  console.log("kamper", matches);
  return { matches };
};
