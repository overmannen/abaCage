from random import shuffle


class Team:
    def __init__(self, players: list[str]):
        self.players = players


class Match:
    def __init__(self, homeTeam: Team, awayTeam: Team):
        self.homeTeam = homeTeam
        self.awayTeam = awayTeam
        self.homeGoals, self.awayGoals = 0, 0


class Round:
    def __init__(self, matches: list[Match]):
        self.matches = matches


class Team:
    def __init__(self, players: list[str]):
        self.players = players


def create_round(players: list[str], numOfPitches: int):
    if numOfPitches <= 0 or len(players) == 0:
        return []

    matches: list[Match] = []
    players_copy = players.copy()
    shuffle(players_copy)

    total_teams = numOfPitches * 2

    teams = [[] for _ in range(total_teams)]

    team_index = 0
    while len(players_copy) > 0:
        player = players_copy.pop()
        teams[team_index].append(player)
        team_index = (team_index + 1) % total_teams

    for i in range(0, len(teams), 2):
        if i + 1 < len(teams):
            homeTeam = Team(teams[i])
            awayTeam = Team(teams[i + 1])
            match = Match(homeTeam, awayTeam)
            matches.append(match)

    return matches
