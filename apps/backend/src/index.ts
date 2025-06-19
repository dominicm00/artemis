import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./trpc.ts";
import { appRouter } from "./routers/index.ts";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// tRPC middleware
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${String(PORT)}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  server.close();
});
