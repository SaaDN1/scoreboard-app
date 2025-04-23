// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

// Update gameData to include three games
let gameData = [
  {
    id: 1,
    homeTeam: {
      city: "Los Angeles",
      name: "Lakers",
      abbreviation: "LAL",
      wins: 51,
      losses: 31,
      score: 52,
      stats: {
        fgPercentage: "36.2%",
        threePointMade: 4,
        threePointAttempts: 28,
        rebounds: 35,
      },
    },
    awayTeam: {
      city: "Boston",
      name: "Celtics",
      abbreviation: "BOS",
      wins: 56,
      losses: 26,
      score: 69,
      stats: {
        fgPercentage: "44.8%",
        threePointMade: 14,
        threePointAttempts: 34,
        rebounds: 32,
      },
    },
    period: 3,
    timeRemaining: "6:42",
    gameStatus: "live",
  },
  {
    id: 2,
    homeTeam: {
      city: "Golden State",
      name: "Warriors",
      abbreviation: "GSW",
      wins: 44,
      losses: 38,
      score: 45,
      stats: {
        fgPercentage: "40.1%",
        threePointMade: 8,
        threePointAttempts: 22,
        rebounds: 28,
      },
    },
    awayTeam: {
      city: "Miami",
      name: "Heat",
      abbreviation: "MIA",
      wins: 48,
      losses: 34,
      score: 50,
      stats: {
        fgPercentage: "42.5%",
        threePointMade: 10,
        threePointAttempts: 25,
        rebounds: 30,
      },
    },
    period: 2,
    timeRemaining: "8:15",
    gameStatus: "live",
  },
  {
    id: 3,
    homeTeam: {
      city: "Chicago",
      name: "Bulls",
      abbreviation: "CHI",
      wins: 40,
      losses: 42,
      score: 38,
      stats: {
        fgPercentage: "38.7%",
        threePointMade: 6,
        threePointAttempts: 20,
        rebounds: 25,
      },
    },
    awayTeam: {
      city: "New York",
      name: "Knicks",
      abbreviation: "NYK",
      wins: 47,
      losses: 35,
      score: 42,
      stats: {
        fgPercentage: "41.2%",
        threePointMade: 7,
        threePointAttempts: 21,
        rebounds: 27,
      },
    },
    period: 1,
    timeRemaining: "10:30",
    gameStatus: "live",
  },
];

// Game simulation data
function simulateGameProgress() {
  gameData.forEach((game) => {
    if (game.gameStatus !== "live") return;

    // Random point scored (0, 1, 2, or 3 points)
    const scoringTeam = Math.random() > 0.5 ? "homeTeam" : "awayTeam";
    const pointsScored = Math.floor(Math.random() * 4);
    if (pointsScored > 0) {
      game[scoringTeam].score += pointsScored;

      // Update stats based on points scored
      if (pointsScored === 3) {
        game[scoringTeam].stats.threePointMade += 1;
        game[scoringTeam].stats.threePointAttempts += 1;
      } else if (pointsScored === 2 || pointsScored === 1) {
        const newPercentage = Math.min(
          Math.max(
            parseFloat(game[scoringTeam].stats.fgPercentage) +
              (Math.random() * 0.5 - 0.25),
            35.0
          ),
          65.0
        ).toFixed(1);
        game[scoringTeam].stats.fgPercentage = newPercentage + "%";
      }
    } else {
      if (Math.random() > 0.7) {
        game[scoringTeam].stats.threePointAttempts += 1;
      }
    }

    // Random rebound
    const reboundTeam = Math.random() > 0.5 ? "homeTeam" : "awayTeam";
    if (Math.random() > 0.7) {
      game[reboundTeam].stats.rebounds += 1;
    }

    // Update time
    const currentMinutes = parseInt(game.timeRemaining.split(":")[0]);
    const currentSeconds = parseInt(game.timeRemaining.split(":")[1]);
    let newSeconds = currentSeconds - Math.floor(Math.random() * 24);
    let newMinutes = currentMinutes;

    if (newSeconds < 0) {
      newMinutes -= 1;
      newSeconds += 60;
    }

    if (newMinutes < 0) {
      game.period += 1;
      if (game.period > 4) {
        if (game.homeTeam.score === game.awayTeam.score) {
          game.timeRemaining = "5:00";
        } else {
          game.gameStatus = "final";
          game.timeRemaining = "0:00";
        }
      } else {
        game.timeRemaining = "12:00";
      }
    } else {
      game.timeRemaining = `${newMinutes}:${newSeconds
        .toString()
        .padStart(2, "0")}`;
    }
  });
}

// Simulate game progress every 3 seconds
setInterval(simulateGameProgress, 3000);

// API endpoint to get current game data
app.get('/api/game', (req, res) => {
  res.json(gameData);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
