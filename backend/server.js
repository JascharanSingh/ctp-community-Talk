// 🌐 Core Modules
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();

// 🧠 Middleware and Auth
const passport = require("passport");
const LocalStrategy = require("passport-local");
const authenticate = require("./middleware/authenticate");

// 🔌 Database
const db = require("./db");

// 📁 Route Files
const personRoutes = require("./routes/loginNregRoutes");
const communityRoutes = require("./routes/communityRoutes");
const memberRoutes = require("./routes/memberRoutes");
const messageRoutes = require("./routes/messageRoutes");
const directMessageRoutes = require('./routes/directMessageRoutes');
const app = express();
const server = http.createServer(app);

// 🧠 Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.join(userId); // join room by user ID
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});


// 🔧 Middleware Setup
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Now it's safe to use routes that rely on req.io
app.use('/api/direct-messages', directMessageRoutes);


app.use(passport.initialize());
const LocalAuthMiddleware = passport.authenticate("local", { session: false });

// 🧾 Logger
app.use((req, res, next) => {
  console.log(
    `${new Date().toLocaleString()} Request made to: ${req.originalUrl}`
  );
  next();
});

// 🔐 Protected Routes
app.use("/api/communities", authenticate, communityRoutes);
app.use("/api/members", authenticate, memberRoutes);
app.use("/api/messages", authenticate, messageRoutes);

// 🔓 Public Routes
app.use("/", personRoutes);

// 🏠 Test Route
app.get("/", LocalAuthMiddleware, (req, res) => {
  res.send("hi");
});
// server.js

// …
app.use("/api/direct-messages", directMessageRoutes);
// 🚀 Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`✅ Server running with Socket.IO on port ${port}`);
});
