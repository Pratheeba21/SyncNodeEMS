// // const path = require("path");
// // require("dotenv").config({ path: path.join(__dirname, ".env") });

// // const express = require("express");
// // const mongoose = require("mongoose");
// // const cors = require("cors");
// // const http = require("http"); // ADD THIS
// // const { Server } = require("socket.io"); // ADD THIS
// // const initSocket = require("./controllers/socketController"); // ADD THIS

// // const app = express();
// // const server = http.createServer(app); // Create HTTP server

// // // Update CORS to allow Socket.io connections
// // const io = new Server(server, {
// //   cors: {
// //     origin: "https://syncnode-m83d.onrender.com", // Use your Vite frontend URL
// //     methods: ["GET", "POST"],
// //   },
// // });

// // app.use(express.json());
// // app.use(cors());

// // mongoose
// //   .connect(
// //     "mongodb+srv://SyncNode:SyncNode12345@cluster0.ixnufht.mongodb.net/SyncNode?appName=Cluster0",
// //   )
// //   .then(() => console.log("💎 SyncNode DB Connected"))
// //   .catch((err) => console.error("❌ Connection Error:", err));

// // // --- Initialize Socket Logic ---
// // initSocket(io);

// // // --- ROUTES ---
// // app.use("/api/auth", require("./routes/auth"));
// // app.use("/api/employee", require("./routes/employee"));
// // app.use("/api/admin", require("./routes/admin"));
// // app.use("/api/lead", require("./routes/lead"));
// // app.use("/api/manager", require("./routes/manager"));
// // app.use("/api/attendance", require("./routes/attendance"));
// // app.use("/api/reports", require("./routes/reports"));
// // app.use("/api/notifications", require("./routes/notifications"));

// // const PORT = process.env.PORT || 5000;

// // // IMPORTANT: Change app.listen to server.listen
// // server.listen(PORT, () => console.log(`🚀 Orbiting on Port ${PORT}`));

// const path = require("path");
// require("dotenv").config({ path: path.join(__dirname, ".env") });

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const http = require("http");
// const { Server } = require("socket.io");
// const initSocket = require("./controllers/socketController");

// const app = express();
// const server = http.createServer(app);

// // 1. Define the Frontend URL consistently
// const FRONTEND_URL = "https://syncnode-m83d.onrender.com";

// // 2. Middleware
// app.use(express.json());
// app.use(
//   cors({
//     origin: FRONTEND_URL,
//     methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
//     credentials: true,
//   }),
// );

// // 3. Socket.io Configuration
// const io = new Server(server, {
//   cors: {
//     origin: FRONTEND_URL,
//     methods: ["GET", "POST"],
//   },
//   // Adding transport settings helps with stable connections on Render
//   transports: ["websocket", "polling"],
// });

// // 4. Database Connection
// // PRO TIP: Use process.env.MONGO_URI in Render's Dashboard instead of hardcoding
// // const dbURI =
// //   process.env.MONGO_URI ||
// //   "mongodb+srv://SyncNode:SyncNode12345@cluster0.ixnufht.mongodb.net/SyncNode?appName=Cluster0";

// // mongoose
// //   .connect(dbURI)
// //   .then(() => console.log("💎 SyncNode DB Connected"))
// //   .catch((err) => {
// //     console.error("❌ Connection Error Detail:", err.message);
// //     // Log the full error to help debug DNS/Network issues
// //   });
// const fallbackURI =
//   "mongodb://SyncNode:SyncNode12345@cluster0-shard-00-00.ixnufht.mongodb.net:27017,cluster0-shard-00-01.ixnufht.mongodb.net:27017,cluster0-shard-00-02.ixnufht.mongodb.net:27017/SyncNode?ssl=true&replicaSet=atlas-ixnufht-shard-0&authSource=admin&retryWrites=true&w=majority";

// const dbURI = process.env.MONGO_URI || fallbackURI;

// mongoose
//   .connect(dbURI, {
//     // These options help stabilize connections across different environments
//     serverSelectionTimeoutMS: 5000,
//     socketTimeoutMS: 45000,
//   })
//   .then(() => console.log("💎 SyncNode DB Connected"))
//   .catch((err) => {
//     console.error("❌ Connection Error Detail:", err.message);
//     if (err.message.includes("ECONNREFUSED")) {
//       console.log(
//         "💡 TIP: Your ISP might be blocking SRV records. Try switching your DNS to 8.8.8.8",
//       );
//     }
//   });

// // 5. Initialize Socket Logic
// initSocket(io);

// // 6. Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/employee", require("./routes/employee"));
// app.use("/api/admin", require("./routes/admin"));
// app.use("/api/lead", require("./routes/lead"));
// app.use("/api/manager", require("./routes/manager"));
// app.use("/api/attendance", require("./routes/attendance"));
// app.use("/api/reports", require("./routes/reports"));
// app.use("/api/notifications", require("./routes/notifications"));

// // 7. Start Server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Orbiting on Port ${PORT}`));

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const initSocket = require("./controllers/socketController");

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = "https://syncnode-m83d.onrender.com";

app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  }),
);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// Standard connection string (Used to bypass local DNS/ISP issues)
const fallbackURI =
  "mongodb://SyncNode:SyncNode12345@cluster0-shard-00-00.ixnufht.mongodb.net:27017,cluster0-shard-00-01.ixnufht.mongodb.net:27017,cluster0-shard-00-02.ixnufht.mongodb.net:27017/SyncNode?ssl=true&replicaSet=atlas-ixnufht-shard-0&authSource=admin&retryWrites=true&w=majority";

const dbURI = process.env.MONGO_URI || fallbackURI;

mongoose
  .connect(dbURI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("💎 SyncNode DB Connected Successfully"))
  .catch((err) => {
    console.error("❌ Connection Error Detail:", err.message);
    console.log(
      "👉 Action: Check MongoDB Atlas > Network Access and ensure 0.0.0.0/0 is ACTIVE.",
    );
  });

initSocket(io);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/employee", require("./routes/employee"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/lead", require("./routes/lead"));
app.use("/api/manager", require("./routes/manager"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/notifications", require("./routes/notifications"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Orbiting on Port ${PORT}`));