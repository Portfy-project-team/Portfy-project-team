import express from 'express';
import authRoutes from "./modules/auth/auth.routes.js";
import { prisma } from './utils/prisma.js';


const app = express();

// Middleware
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Test DB route
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

export default app;

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });