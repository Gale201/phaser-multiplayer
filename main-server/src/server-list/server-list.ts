import { GameServerData } from "@shared/network/types";

export const servers: GameServerData[] = [
  {
    id: "eu-1",
    region: "eu",
    name: "EU Server 1",
    url: "http://localhost:3002",
    rooms: [
      { id: "1", name: "Room 1", players: 0, maxPlayers: 10 },
      { id: "2", name: "Room 2", players: 0, maxPlayers: 10 },
    ],
  },
  {
    id: "na-1",
    region: "na",
    name: "NA Server 1",
    url: "http://localhost:3003",
    rooms: [{ id: "1", name: "Room 1", players: 0, maxPlayers: 10 }],
  },
];
