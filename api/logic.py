from random import shuffle


class Team:
    def __init__(self, players: list[str]):
        self.players = players


class Match:
    def __init__(self, home_team: Team, away_team: Team):
        self.home_team = home_team
        self.away_team = away_team
        self.home_goals, self.away_goals = 0, 0


class Round:
    def __init__(self, matches: list[Match]):
        self.matches = matches


class Team:
    def __init__(self, players: list[str]):
        self.players = players


def create_round_pitches(players: list[str], num_of_pitches: int) -> list[Match]:
    if num_of_pitches <= 0 or len(players) == 0:
        return []

    matches: list[Match] = []
    players_copy = players.copy()
    shuffle(players_copy)

    total_teams = num_of_pitches * 2

    teams = [[] for _ in range(total_teams)]

    team_index = 0
    while len(players_copy) > 0:
        player = players_copy.pop()
        teams[team_index].append(player)
        team_index = (team_index + 1) % total_teams

    for i in range(0, len(teams), 2):
        if i + 1 < len(teams):
            home_team = Team(teams[i])
            away_team = Team(teams[i + 1])
            match = Match(home_team, away_team)
            matches.append(match)

    return matches


def create_round_teams(players: list[str], num_of_teams: int) -> list[Match]:
    if num_of_teams < 2 or len(players) == 0:
        return []

    matches: list[Match] = []
    players_copy = players.copy()
    shuffle(players_copy)

    teams = [[] for _ in range(num_of_teams)]

    team_index = 0
    while len(players_copy) > 0:
        player = players_copy.pop()
        teams[team_index].append(player)
        team_index = (team_index + 1) % num_of_teams

    for i in range(num_of_teams):
        for j in range(i + 1, num_of_teams):
            home_team = Team(teams[i])
            away_team = Team(teams[j])
            matches.append(Match(home_team, away_team))

    return matches
