require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const Connectdb = require("./src/Config/db");
const setupSocket = require("./src/socket/socket");


// MongoDB Connection
Connectdb();


// Create HTTP Server
const server = http.createServer(app);


// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "https://chat-app-1-7lvl.onrender.com",
        methods: ["GET", "POST"]
    }
});


// Socket Events
setupSocket(io);


// Start Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
