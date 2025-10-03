import type { PlayerType } from "./App";
import { API_BASE_URL } from "./config";

export const createRoundPitches = async (
  players: PlayerType[],
  numOfPitches: number
) => {
  try {
    const playerNames = players.map((player) => player.name);
    const requestData = {
      players: playerNames,
      numOfPitches: numOfPitches,
    };

    const response = await fetch(`${API_BASE_URL}/create_round_pitches/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "error") {
      throw new Error(result.message);
    }

    return result.data.round;
  } catch (error) {
    console.error("Error with creation of round:", error);
    throw error;
  }
};

export const createRoundTeams = async (
  players: PlayerType[],
  numOfTeams: number
) => {
  try {
    const playerNames = players.map((player) => player.name);
    const requestData = {
      players: playerNames,
      numOfTeams: numOfTeams,
    };

    const response = await fetch(`${API_BASE_URL}/create_round_teams/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === "error") {
      throw new Error(result.message);
    }

    return result.data.round;
  } catch (error) {
    console.error("Error with creation of round:", error);
    throw error;
  }
};
