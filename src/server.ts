import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";

const app = express();
const port = process.env.PORT ?? 3000;

// Define allowed origins explicitly
const allowedOrigins = [
  process.env.CLIENT_URL || "https://ideco-lms-client-production.up.railway.app",
  "http://localhost:3000", // For local development
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, origin?: string) => void) => {
    // Allow requests with no origin (e.g., server-to-server) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.json()); // Ensure JSON parsing is enabled

// Log requests for debugging
app.all("/api/auth/*splat", (req, res, next) => {
  console.log("Auth request:", req.method, req.url, req.headers, req.body);
  toNodeHandler(auth)(req, res);
});

app.listen(port, () => {
  console.log(`Better Auth app listening on port ${port}`);
  console.log("Allowed Origins:", allowedOrigins);
});