import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import { app, server } from "./src/socket/socket.js";

import authRoutes from "./src/routes/auth.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";

import connectToMongoDB from "./src/db/connectToMongoDB.js";

const port = process.env.PORT || 3000;

// Enable CORS for specific origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies and authentication headers
  })
);

// Middleware
app.use(express.json()); // to parse the incoming request as JSON
app.use("/api/auth", authRoutes); // to use the auth routes

// for file upload
app.use(uploadRoutes);

// Define the routes
app.get("/", (req, res) => {
  res.send("Catalyst Backend");
});

// Start the server
server.listen(port, () => {
  // Connect to MongoDB
  connectToMongoDB();
  console.log(`Server is running on port ${port}`);
});
