const http = require("http");
const app = require("./index");
const { Server } = require("socket.io");
const { generate } = require("random-words");

const PORT = process.env.PORT || 5000;
let serverStatus = true;

// Set up basic express route
function router(status, port) {
  app.get("/", (req, res) => {
    res.json({
      "Server Status": status,
      "Server URL": `http://localhost:${port}`,
    });
  });
}

router(serverStatus, PORT);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

// Game state
let lastWord = generate();
let usedWords = [lastWord];
let players = {};
let turnOrder = [];
let currentTurn = 0;

// Socket.io connection
io.on("connection", (socket) => {
  console.log("✅ Player connected:", socket.id);

  // Player registers with a name
  socket.on("register", (name) => {
    players[socket.id] = { name, score: 0 };
    turnOrder.push(socket.id);

    if (turnOrder.length === 1) {
      currentTurn = 0; // First player starts
    }

    sendGameState();
  });

  // Handle submitted word
  socket.on("sendWord", (word) => {
    const playerId = socket.id;
    const player = players[playerId];

    if (!player) return;

    if (turnOrder[currentTurn] !== playerId) {
      socket.emit("errorMessage", "❌ It's not your turn!");
      return;
    }

    if (word[0].toLowerCase() !== lastWord.slice(-1).toLowerCase()) {
      socket.emit(
        "errorMessage",
        "❌ Word must start with the last letter of the previous word."
      );
      return;
    }

    if (usedWords.includes(word.toLowerCase())) {
      socket.emit("errorMessage", "❌ This word has already been used.");
      return;
    }

    // Valid word
    lastWord = word;
    usedWords.push(word.toLowerCase());
    player.score += 1;
    currentTurn = (currentTurn + 1) % turnOrder.length;

    sendGameState();
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ Player disconnected:", socket.id);

    delete players[socket.id];
    turnOrder = turnOrder.filter((id) => id !== socket.id);

    if (turnOrder.length === 0) {
      lastWord = generate();
      usedWords = [lastWord];
      currentTurn = 0;
    } else {
      currentTurn = currentTurn % turnOrder.length;
    }

    sendGameState();
  });

  // Helper to send game state to all players
  function sendGameState() {
    io.emit("gameState", {
      lastWord,
      usedWords,
      players,
      currentPlayer: players[turnOrder[currentTurn]]?.name,
    });
  }
});

// Start the server
server.listen(PORT, (error) => {
  if (error) {
    console.error("❌ Server failed to start:", error);
  } else {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  }
});
