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
    super(hitbox || new Box(100, 100, 40, 10));
    this.socket = socket;
    this.username = username;

    this.id = socket.id;

    this.setupSocketEvents();
  }

  update(deltaTime: number): void {
    this.intendedPosition = this.hitbox
      .getPosition()
      .add(this.velocity.scale(deltaTime));
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
    if (this.velocity.x > 0) {
      this.hitbox.x = collidable.getHitbox().x - this.hitbox.w;
    } else if (this.velocity.x < 0) {
      this.hitbox.x = collidable.getHitbox().right;
    }
  }

  handleCollisionForYAxis(collidable: Collidable): void {
    if (this.velocity.y > 0) {
      this.hitbox.y = collidable.getHitbox().y - this.hitbox.h;
    } else if (this.velocity.y < 0) {
      this.hitbox.y = collidable.getHitbox().bottom;
    }
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
