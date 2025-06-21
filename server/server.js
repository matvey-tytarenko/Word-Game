const http = require("http");
const app = require("./index");

// Server Config
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, (error) => {
  if (error) {
    app.get("/", (req, res) => {
      res.status(400).json({
        "Server status": false,
      });
    });
    console.error(`Server Error: ${error}`);
  } else {
    app.get("/", (req, res) => {
      res.json({
        "Server status": true,
        "Server url": `http://localhost:${PORT}`,
      });
    });
    console.log(`Server has been started on PORT: ${PORT}`);
  }
});
