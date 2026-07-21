import "dotenv/config";

import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";

import { initializeSocket } from "./socket/socket.js";
import socketAuth from "./middlewares/socketAuth.middleware.js";
import { registerDiscussionSocket } from "./socket/discussion.socket.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = initializeSocket(server);

io.use(socketAuth);

registerDiscussionSocket(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});