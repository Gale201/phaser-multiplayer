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

export type PlayerData = {
  id: string;
  username: string;
  hitbox: { x: number; y: number; w: number; h: number };
  velocity: { x: number; y: number };
};

export type GameUpdateData = {
  players: PlayerData[];
  tiles: { x: number; y: number; w: number; h: number }[];
  colliders: { x: number; y: number; w: number; h: number }[];
};
