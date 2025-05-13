import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { auth } from "./lib/auth";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL as string,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.PORT ?? 3000;

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());
 
app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});