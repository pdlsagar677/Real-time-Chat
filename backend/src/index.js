import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth-route.js";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message-route.js";
import bodyParser from 'body-parser';
import { initSocket, getIo } from "./lib/socket.js";
import adminRoutes from "./routes/admin-route.js";

// Load environment variables
dotenv.config();
const PORT = process.env.PORT;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const certPath = path.resolve(__dirname, "../../certs/cert.pem");
const keyPath = path.resolve(__dirname, "../../certs/key.pem");

// Create app and server (HTTPS if certs exist, otherwise HTTP)
const app = express();
let server;
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  server = https.createServer(
    { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
    app
  );
  console.log("Using HTTPS server");
} else {
  server = http.createServer(app);
  console.log("Using HTTP server (no certs found)");
}

// Initialize Socket.IO
initSocket(server);

// Store io in app for routes to access
app.set('io', getIo());

// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.RENDER_EXTERNAL_URL || true
    : process.env.FRONTEND_URL,
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));

  // SPA fallback — any non-API route serves index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Start server
server.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);
  try {
    await connectDB();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed", err);
  }
});
