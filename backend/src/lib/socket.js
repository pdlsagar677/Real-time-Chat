import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// userId -> socketId
const userSocketMap = {};
// userId -> activeCallUserId
const activeCalls = {};

export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ================= CALL INIT =================
  socket.on("call:user", ({ from, to }) => {
    if (activeCalls[from] || activeCalls[to]) {
      io.to(socket.id).emit("call:busy");
      return;
    }

    const receiverSocketId = userSocketMap[to];
    if (!receiverSocketId) {
      io.to(socket.id).emit("call:user-offline");
      return;
    }

    activeCalls[from] = to;
    activeCalls[to] = from;

    io.to(receiverSocketId).emit("call:incoming", { from });

    // CALL TIMEOUT (30s)
    setTimeout(() => {
      if (activeCalls[from] === to) {
        delete activeCalls[from];
        delete activeCalls[to];
        io.to(receiverSocketId).emit("call:ended");
        io.to(userSocketMap[from]).emit("call:ended");
      }
    }, 30000);
  });

  // ================= ACCEPT =================
  socket.on("call:accept", ({ to }) => {
    io.to(userSocketMap[to]).emit("call:accepted");
  });

  // ================= REJECT =================
  socket.on("call:reject", ({ to }) => {
    delete activeCalls[to];
    delete activeCalls[userId];
    io.to(userSocketMap[to]).emit("call:rejected");
  });

  // ================= END =================
  socket.on("call:end", ({ to }) => {
    delete activeCalls[to];
    delete activeCalls[userId];
    io.to(userSocketMap[to]).emit("call:ended");
  });

  // ================= WEBRTC =================
  socket.on("webrtc:offer", ({ to, offer }) => {
    io.to(userSocketMap[to]).emit("webrtc:offer", { offer });
  });

  socket.on("webrtc:answer", ({ to, answer }) => {
    io.to(userSocketMap[to]).emit("webrtc:answer", { answer });
  });

  socket.on("webrtc:ice-candidate", ({ to, candidate }) => {
    io.to(userSocketMap[to]).emit("webrtc:ice-candidate", { candidate });
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    const peer = activeCalls[userId];
    if (peer) {
      delete activeCalls[peer];
      io.to(userSocketMap[peer]).emit("call:ended");
    }
    delete activeCalls[userId];
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
