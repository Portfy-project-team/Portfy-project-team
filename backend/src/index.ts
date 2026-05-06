import "dotenv/config";

import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import prisma from "./shared/utils/prisma.js";
import usersRoutes from "./modules/user/user.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import cookieParser from "cookie-parser"
const app = express();
app.use(cookieParser());
// Middleware
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);
// user routes
app.use("/users", usersRoutes);
// admin routes
app.use("/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

//Test DB route
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default app;

// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });
// app.listen(PORT, () => {
//   console.log(`Portfy API démarrée sur le port ${PORT}`);
//   console.log(`Environnement : ${process.env.NODE_ENV}`);
// });
