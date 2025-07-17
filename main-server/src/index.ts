import express from "express";
import cors from "cors";
import serversRouter from "./routes/servers";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api/servers", serversRouter);
app.use("/api/servers", serversRouter);

app.listen(PORT, () => {
  console.log(`[SERVER] Main lobby server running at http://localhost:${PORT}`);
});
