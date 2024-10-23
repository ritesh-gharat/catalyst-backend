import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";

import { generateResponse } from "../services/geminiAPI.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  // console.log("User Connected", socket.id);

  // Handle the "generate" event
  socket.on("generate", async (session) => {
    //console.log(session);

    // Initialize the response
    let response = "";

    try {
      // Emit a response to the client
      socket.emit("generateRes", "Generating...");

      // Generate a response
      const result = await generateResponse(session);

      // Stream the response to the client
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        //console.log(chunkText);

        response += chunkText;
        // Emit the response to the client
        socket.emit("generateRes", chunkText);
      }

      // Emit the end of the db response to the client
      socket.emit("response", response);
    } catch (error) {
      // Emit the response to the client
      socket.emit("response", response);

      // Log the error
      console.error("Error handling request:", error);
      socket.emit("error", error.message);
    }
  });

  // Handle the "disconnect" event
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

export { app, server, io };
