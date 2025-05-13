import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { auth } from "./lib/auth";

const app = express();
const port = process.env.PORT ?? 3000;

const whitelist = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());
 
app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});