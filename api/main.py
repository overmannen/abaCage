from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from logic import create_round


class CreateRoundRequest(BaseModel):
    players: list[str]
    numOfPitches: int


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/rounds/")
def create_round_request(request: CreateRoundRequest):
    try:
        if len(request.players) < 2:
            return {"status": "error", "message": "Need two players"}

        if request.numOfPitches < 1:
            return {"status": "error", "message": "Need one pitch"}

        matches = create_round(request.players, request.numOfPitches)

        serializable_matches = []

        for match in matches:
            home_players = match.homeTeam.players

            away_players = match.awayTeam.players

            match_dict = {
                "homeTeam": "&".join(home_players) if home_players else "Lag 1",
                "awayTeam": "&".join(away_players) if away_players else "Lag 2",
                "result": f"{match.homeGoals}-{match.awayGoals}",
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

    uvicorn.run(app, host="0.0.0.0", port=8000)
