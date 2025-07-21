import { GameScene } from "../main/game";
import { Player } from "./player";
import { RemotePlayer } from "./remote-player";
import { PlayerData } from "@shared/network/types";

export class PlayerManager {
  private scene: GameScene;

  private player: Player;
  private remotePlayers: Map<string, RemotePlayer> = new Map();

  constructor(
    scene: GameScene,
    playerData: { x: number; y: number; id: string; username: string }
  ) {
    this.scene = scene;

    this.player = new Player(
      this.scene,
      playerData.x,
      playerData.y,
      playerData.id,
      playerData.username
    );
  }

  create() {
    this.player.create();
    this.scene.cameras.main.startFollow(this.player.getSprite());
  }

  update(deltaTime: number) {
    this.remotePlayers.forEach((player) => player.update(deltaTime));
    this.player.update(deltaTime);
  }

  updatePlayers(players: Array<PlayerData>) {
    if (!this.player.getSprite()) return;

    for (const player of players) {
      if (player.id === this.player.getId()) {
        this.player.setPosition(player.hitbox.x, player.hitbox.y);
      } else if (this.remotePlayers.has(player.id)) {
        this.remotePlayers
          .get(player.id)!
          .setPosition(player.hitbox.x, player.hitbox.y);
        this.remotePlayers
          .get(player.id)!
          .setVelocity(player.velocity.x, player.velocity.y);
      } else {
        this.addRemotePlayer(player);
        console.log("Added remote player:", player.id);
      }
    }
  }

  addRemotePlayer(player: PlayerData) {
    const remotePlayer = new RemotePlayer(
      this.scene,
      player.hitbox.x,
      player.hitbox.y,
      player.id,
      player.username
    );
    remotePlayer.create();
    this.remotePlayers.set(player.id, remotePlayer);
  }

  removePlayer(id: string) {}

  hasPlayer(id: string): boolean {
    if (this.player && id === this.player.getId()) return true;
    if (this.remotePlayers.get(id)) return true;
    return false;
  }

  getPlayerCount(): number {
    return Object.keys(this.remotePlayers).length + 1;
  }

  setPlayerUsername(id: string, username: string) {
    const remotePlayer = this.remotePlayers.get(id);
    if (remotePlayer) {
      remotePlayer.setUsername(username);
    }
  }

  getPlayer(): Player {
    return this.player;
  }
}
