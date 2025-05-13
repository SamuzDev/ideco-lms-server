import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { auth } from "./lib/auth";

const app = express();
const port = process.env.PORT ?? 3000;

const corsOptions = {
  origin: process.env.CLIENT_URL as string,
  credentials: true,
};

app.use(cors(corsOptions));

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());
 
app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});