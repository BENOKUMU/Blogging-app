import path from "node:path";
import express from "express";
import cors from "cors";
import "dotenv/config";
import admin from "firebase-admin";

import Server from "./server.js";

// configs
import { serviceAccountKey } from "./configs/index.js";

// routers
import authRouter from "./api/v1/routes/auth.js";
import blogsRouter from "./api/v1/routes/blogs.js";
import usersRouter from "./api/v1/routes/users.js";
import commentsRouter from "./api/v1/routes/comments.js";
import notificationRouter from "./api/v1/routes/notification.js";
import adminRouter from "./api/v1/routes/admin.js";

const __dirname = path.resolve();

const app = express();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173"], // Update with actual domains
  methods: ["POST", "PUT", "DELETE", "GET"],
  credentials: true
}));

// Set both COOP and COEP headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Middleware for parsing JSON requests
app.use(express.json());

// Firebase Admin SDK initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Root route to test server
app.get("/", (req, res) => {
  res.send("Welcome to the backend server! ❤️");
});

app.get("/hello", (req, res) => {
  res.send("Hello");
});

// API routes
app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/blogs/", blogsRouter);
app.use("/api/v1/users/", usersRouter);
app.use("/api/v1/comments/", commentsRouter);
app.use("/api/v1/notifications/", notificationRouter);
app.use("/api/v1/admin/", adminRouter);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  // Catch-all route for single-page apps (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

// Start the server
Server.startServer(app);
