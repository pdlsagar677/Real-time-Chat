import { Server } from "socket.io";

// Create global variables that can be accessed
let ioInstance = null;
let userSocketMap = {};
let activeCalls = {};
let pendingCalls = {};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === "production"
        ? process.env.RENDER_EXTERNAL_URL || true
        : process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  ioInstance = io;

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // ================= CALL SIGNALING =================

    socket.on("call:user", ({ to, callerInfo, callType }) => {
      // Check if receiver is online
      if (!userSocketMap[to]) {
        socket.emit("call:user-offline");
        return;
      }

      // Check if receiver is busy (in active call or already being called)
      if (activeCalls[to] || pendingCalls[to]) {
        socket.emit("call:busy");
        return;
      }

      // Check if caller is already in a call
      if (activeCalls[userId]) {
        socket.emit("call:busy");
        return;
      }

      // Start 30s timeout for unanswered call
      const timeoutId = setTimeout(() => {
        socket.emit("call:missed");
        const receiverSocketId = userSocketMap[to];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("call:timeout");
        }
        delete pendingCalls[to];
      }, 30000);

      // Store pending call
      pendingCalls[to] = { callerId: userId, callType, timeoutId };

      // Notify receiver
      const receiverSocketId = userSocketMap[to];
      io.to(receiverSocketId).emit("call:incoming", {
        from: userId,
        callerInfo,
        callType,
      });
    });

    socket.on("call:accept", ({ to }) => {
      // Clean up pending call
      const pending = pendingCalls[userId];
      if (pending) {
        clearTimeout(pending.timeoutId);
        delete pendingCalls[userId];
      }

      // Set active call for both parties
      activeCalls[userId] = to;
      activeCalls[to] = userId;

      // Notify caller
      const callerSocketId = userSocketMap[to];
      if (callerSocketId) {
        io.to(callerSocketId).emit("call:accepted");
      }
    });

    socket.on("call:reject", ({ to }) => {
      // Clean up pending call
      const pending = pendingCalls[userId];
      if (pending) {
        clearTimeout(pending.timeoutId);
        delete pendingCalls[userId];
      }

      // Notify caller
      const callerSocketId = userSocketMap[to];
      if (callerSocketId) {
        io.to(callerSocketId).emit("call:rejected");
      }
    });

    socket.on("call:end", ({ to }) => {
      // Clean up active calls
      delete activeCalls[userId];
      delete activeCalls[to];

      // Clean up any pending calls involving either party
      if (pendingCalls[userId]) {
        clearTimeout(pendingCalls[userId].timeoutId);
        delete pendingCalls[userId];
      }
      if (pendingCalls[to]) {
        clearTimeout(pendingCalls[to].timeoutId);
        delete pendingCalls[to];
      }

      // Notify peer
      const peerSocketId = userSocketMap[to];
      if (peerSocketId) {
        io.to(peerSocketId).emit("call:ended");
      }
    });

    // ================= WEBRTC RELAY =================

    socket.on("webrtc:offer", ({ to, offer }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("webrtc:offer", { from: userId, offer });
      }
    });

    socket.on("webrtc:answer", ({ to, answer }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("webrtc:answer", { from: userId, answer });
      }
    });

    socket.on("webrtc:ice-candidate", ({ to, candidate }) => {
      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("webrtc:ice-candidate", { from: userId, candidate });
      }
    });

    // ================= DISCONNECT =================

    socket.on("disconnect", () => {
      // Clean up active calls
      const peer = activeCalls[userId];
      if (peer) {
        delete activeCalls[peer];
        const peerSocketId = userSocketMap[peer];
        if (peerSocketId) {
          io.to(peerSocketId).emit("call:ended");
        }
      }
      delete activeCalls[userId];

      // Clean up pending calls where this user is the receiver
      if (pendingCalls[userId]) {
        clearTimeout(pendingCalls[userId].timeoutId);
        const callerId = pendingCalls[userId].callerId;
        const callerSocketId = userSocketMap[callerId];
        if (callerSocketId) {
          io.to(callerSocketId).emit("call:ended");
        }
        delete pendingCalls[userId];
      }

      // Clean up pending calls where this user is the caller
      for (const [receiverId, call] of Object.entries(pendingCalls)) {
        if (call.callerId === userId) {
          clearTimeout(call.timeoutId);
          const receiverSocketId = userSocketMap[receiverId];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("call:ended");
          }
          delete pendingCalls[receiverId];
        }
      }

      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
};

// Export helper functions
export const getReceiverSocketId = (userId) => userSocketMap[userId];
export const getIo = () => ioInstance;
