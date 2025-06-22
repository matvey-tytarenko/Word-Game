const http = require("http");
const app = require("./index");

const PORT = process.env.PORT || 5000;
let status = true;

router(status, PORT);

// Server Config
const server = http.createServer(app);

// Routing
function router(status, port) {
  app.get("/", (req, res) => {
    res.json({
      "Server Status": status,
      "Server URL": `http://localhost:${port}`,
      "Database Connected": "successfully!",
    });
  });
}

// Start server
server.listen(PORT, (error) => {
  if (error) {
    console.error("❌ Server failed:", error);
  } else {
    console.log(`✅ Server started on http://localhost:${PORT}`);
  }
});
