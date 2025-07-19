import { Router } from "express";
import { servers } from "../server-list/server-list";
import { GameServerData } from "@shared/server/server-types";

const router = Router();

router.get("/", (req, res) => {
  res.json(servers);
});

router.post("/", (req, res) => {
  const { serverId, roomName, players } = req.body;
  if (!serverId || !roomName || typeof players !== "number") {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const server: GameServerData = servers.find((s) => s.id === serverId)!;
  if (!server) {
    return res.status(404).json({ error: "Server not found." });
  }

  const room = server.rooms.find((r) => r.name === roomName);
  if (!room) {
    return res.status(404).json({ error: "Room not found." });
  }

  room.players = players;

  console.log(
    `[SERVER] Updated player count for room '${roomName}' on server ${serverId}: ${players}`
  );

  return res
    .status(200)
    .json({ message: "Player count updated successfully." });
});

export default router;
