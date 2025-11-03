from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from logic import create_round_pitches, create_round_teams
import os


class CreateRoundPitchesRequest(BaseModel):
    players: list[str]
    numOfPitches: int


class CreateRoundTeamsRequest(BaseModel):
    players: list[str]
    numOfTeams: int


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://abacage.lyngner.com/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/create_round_pitches/")
def create_round_request(request: CreateRoundPitchesRequest):
    try:
        if len(request.players) < 2:
            return {"status": "error", "message": "Need two players"}

        if request.numOfPitches < 1:
            return {"status": "error", "message": "Need one pitch"}

        matches = create_round_pitches(request.players, request.numOfPitches)

        serializable_matches = []

        for match in matches:
            home_players = match.home_team.players

            away_players = match.away_team.players

            match_dict = {
                "homeTeam": "&".join(home_players) if home_players else "Lag 1",
                "awayTeam": "&".join(away_players) if away_players else "Lag 2",
                "result": f"{match.home_goals}-{match.away_goals}",
            }

            serializable_matches.append(match_dict)

        return {"status": "ok", "data": {"round": {"matches": serializable_matches}}}
    except Exception as e:
        print(f"Error details: {e}")

        import traceback

        traceback.print_exc()
        return {"status": "error", "message": f"Error in creating round: {str(e)}"}


@app.post("/create_round_teams/")
def create_round_teams_request(request: CreateRoundTeamsRequest):
    try:
        if len(request.players) < 2:
            return {"status": "error", "message": "Need two players"}

        if request.numOfTeams < 2:
            return {"status": "error", "message": "Need two teams"}

        matches = create_round_teams(request.players, request.numOfTeams)

        serializable_matches = []

        for match in matches:
            home_players = match.home_team.players

            away_players = match.away_team.players

            match_dict = {
                "homeTeam": "&".join(home_players) if home_players else "Lag 1",
                "awayTeam": "&".join(away_players) if away_players else "Lag 2",
                "result": f"{match.home_goals}-{match.away_goals}",
            }

            serializable_matches.append(match_dict)

        return {"status": "ok", "data": {"round": {"matches": serializable_matches}}}
    except Exception as e:
        print(f"Error details: {e}")

        import traceback

        traceback.print_exc()
        return {"status": "error", "message": f"Error in creating round: {str(e)}"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
