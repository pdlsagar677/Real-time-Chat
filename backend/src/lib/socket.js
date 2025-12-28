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

// helper
export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  /**
   * ===============================
   * CALL SIGNALING EVENTS
   * ===============================
   */

  // User A calls User B
  socket.on("call:user", ({ to, from }) => {
    const receiverSocketId = userSocketMap[to];

    if (!receiverSocketId) {
      io.to(socket.id).emit("call:user-offline");
      return;
    }

    io.to(receiverSocketId).emit("call:incoming", {
      from,
    });
  });

  // User B accepts call
  socket.on("call:accept", ({ to }) => {
    const callerSocketId = userSocketMap[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call:accepted");
    }
  });

  // User B rejects call
  socket.on("call:reject", ({ to }) => {
    const callerSocketId = userSocketMap[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call:rejected");
    }
  });

  // Call ended by either user
  socket.on("call:end", ({ to }) => {
    const otherUserSocketId = userSocketMap[to];
    if (otherUserSocketId) {
      io.to(otherUserSocketId).emit("call:ended");
    }
  });

  /**
   * ===============================
   * WEBRTC SIGNALING
   * ===============================
   */

  socket.on("webrtc:offer", ({ to, offer }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("webrtc:offer", { offer });
    }
  });

  socket.on("webrtc:answer", ({ to, answer }) => {
    const callerSocketId = userSocketMap[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("webrtc:answer", { answer });
    }
  });

  socket.on("webrtc:ice-candidate", ({ to, candidate }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("webrtc:ice-candidate", { candidate });
    }
  });

  /**
   * ===============================
   * DISCONNECT
   * ===============================
   */

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
