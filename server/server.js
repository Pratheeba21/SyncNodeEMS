const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // ADD THIS
const { Server } = require("socket.io"); // ADD THIS
const initSocket = require("./controllers/socketController"); // ADD THIS

const app = express();
const server = http.createServer(app); // Create HTTP server

// Update CORS to allow Socket.io connections
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Use your Vite frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("💎 SyncNode DB Connected"))
  .catch((err) => console.error("❌ Connection Error:", err));

// --- Initialize Socket Logic ---
initSocket(io);

// --- ROUTES ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/employee", require("./routes/employee"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/lead", require("./routes/lead"));
app.use("/api/manager", require("./routes/manager"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/notifications", require("./routes/notifications"));

const PORT = process.env.PORT || 5000;

// IMPORTANT: Change app.listen to server.listen
server.listen(PORT, () => console.log(`🚀 Orbiting on Port ${PORT}`));