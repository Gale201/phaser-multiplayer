export type GameRoomData = {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
};

export type GameServerData = {
  id: string;
  region: string;
  name: string;
  url: string;
  rooms: GameRoomData[];
};
