import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { auth } from "./lib/auth";

const app = express();

const port = process.env.PORT ?? 3000;

app.all('/api/auth/{*any}', toNodeHandler(auth));

const corsOptions = {
  origin: 'https://ideco-lms-client-production.up.railway.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
 
app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});