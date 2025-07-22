import { Socket } from "socket.io";
import { Serializable } from "../utils/serializable";
import { Signals } from "@shared/signals/signals";
import { Vector2 } from "../physics/vectors";
import { Entity } from "./entity";
import { Box } from "../physics/box";
import { MovingEntity } from "./moving-entity";
import { Collidable } from "../physics/collidable";
import { PlayerData } from "@shared/network/types";

export class Player extends MovingEntity implements Serializable {
  static readonly speed = 5;

  private readonly socket: Socket;
  private username: string;

  constructor(socket: Socket, username: string, hitbox: Box | null = null) {
    super(hitbox || Box.zero());
    this.socket = socket;
    this.username = username;

    this.id = socket.id;

    this.setupSocketEvents();
  }

  update(deltaTime: number): void {
    this.hitbox.addPosition(this.velocity.scale(deltaTime));
  }

  private setupSocketEvents() {
    this.socket.on(Signals.SET_PLAYER_DIRECTION, (data) => {
      this.velocity = new Vector2(data.x * Player.speed, data.y * Player.speed);
    });
  }

  send(signal: Signals, data: any = null) {
    this.socket.emit(signal, data);
  }

  handleCollisionForXAxis(collidable: Collidable): void {
    throw new Error("Method not implemented.");
  }
  handleCollisionForYAxis(collidable: Collidable): void {
    throw new Error("Method not implemented.");
  }

  serialized(): PlayerData {
    return {
      id: this.id,
      username: this.username,
      hitbox: this.hitbox,
      velocity: this.velocity,
    };
  }

  getId(): string {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }
}
