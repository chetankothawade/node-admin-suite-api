// socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// ------------------- SOCKET.IO INIT -------------------
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // your frontend origin
    methods: ["GET", "POST"],
  },
});

// ------------------- USER SOCKET MAP -------------------
const userSocketMap = {}; // { userId -> socketId }

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// ------------------- SOCKET EVENTS -------------------
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: ${userId} (${socket.id})`);
  }

  // Notify all clients of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Join conversation room when user opens a chat
  socket.on("joinConversation", (conversationId) => {
    if (conversationId) {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${userId} joined room: conversation_${conversationId}`);
    }
  });

  // ✅ Typing indicator
  socket.on("typing", (data) => {
    const { conversationId, senderId } = data;
    socket.to(`conversation_${conversationId}`).emit("userTyping", { senderId });
  });

  // ✅ Message seen
  socket.on("messageSeen", (data) => {
    const { conversationId, messageId, seenBy } = data;
    io.to(`conversation_${conversationId}`).emit("messageSeenUpdate", {
      conversationId,
      messageId,
      seenBy,
    });
  });

  // ------------------- ON DISCONNECT -------------------
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
