// socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
import logger from "../utils/logger.js";

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
const userSocketMap = {}; // { user_id -> socketId }

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// ------------------- SOCKET EVENTS -------------------
io.on("connection", (socket) => {
  const user_id = socket.handshake.query.user_id;
  if (user_id) {
    userSocketMap[user_id] = socket.id;
    logger.info({ user_id, socketId: socket.id }, "User connected");
  }

  // Notify all clients of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Join conversation room when user opens a chat
  socket.on("joinConversation", (conversation_id) => {
    if (conversation_id) {
      socket.join(`conversation_${conversation_id}`);
      logger.info({ user_id, conversation_id }, "User joined conversation room");
    }
  });

  // ✅ Typing indicator
  socket.on("typing", (data) => {
    const { conversation_id, sender_id } = data;
    socket.to(`conversation_${conversation_id}`).emit("userTyping", { sender_id });
  });

  // ✅ Message seen
  socket.on("messageSeen", (data) => {
    const { conversation_id, message_id, seenBy } = data;
    io.to(`conversation_${conversation_id}`).emit("messageSeenUpdate", {
      conversation_id,
      message_id,
      seenBy,
    });
  });

  // ------------------- ON DISCONNECT -------------------
  socket.on("disconnect", () => {
    logger.info({ user_id }, "User disconnected");
    if (user_id) delete userSocketMap[user_id];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server };


