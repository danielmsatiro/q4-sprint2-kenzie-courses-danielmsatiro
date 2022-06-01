import express from "express";
import registerRouters from "./routes";

const app = express();

app.use(express.json());
registerRouters(app);

export default app;
