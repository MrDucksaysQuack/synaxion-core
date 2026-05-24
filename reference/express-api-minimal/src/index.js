import express from "express";
import { validateEnv } from "./lib/env.mjs";

if (process.env.NODE_ENV !== "test") {
  validateEnv();
}

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const port = Number(process.env.PORT ?? 3000);
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`synaxion-reference-express-api listening on ${port}`);
  });
}

export default app;
