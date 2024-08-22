import express from "express";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.routes.js";
import connectToMongoDB from "./src/db/connectToMongoDB.js";

const port = process.env.PORT || 3000;
const app = express();
dotenv.config();

// Middleware
app.use(express.json()); // to parse the incoming request as JSON
app.use("/api/auth", authRoutes); // to use the auth routes

// Define the routes
app.get("/", (req, res) => {
  res.send("Catalyst Backend");
});

// Start the server
app.listen(port, () => {
  // Connect to MongoDB
  connectToMongoDB();
  console.log(`Server is running on port ${port}`);
});
