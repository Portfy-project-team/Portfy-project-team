import express from 'express'
import authRoutes from "./modules/auth/auth.routes.js"
import { prisma } from './utils/prisma.js'

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Portfy API démarrée sur le port ${PORT}`);
  console.log(`Environnement : ${process.env.NODE_ENV}`);
});