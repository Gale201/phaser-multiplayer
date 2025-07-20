import { Socket } from "socket.io";
import { Serializable } from "../utils/serializable";
import { Signals } from "@shared/signals/signals";
import { Vector2 } from "../physics/vectors";
import { Entity } from "./entity";
import { Box } from "../physics/box";

export class Player extends Entity implements Serializable {
  private readonly socket: Socket;
  private username: string;

  constructor(socket: Socket, username: string, hitbox: Box) {
    super(hitbox);
    this.socket = socket;
    this.username = username;

    this.id = socket.id;
  }

  update(deltaTime: number): void {}

  send(signal: Signals, data: any = null) {
    this.socket.emit(signal, data);
  }

  serialized() {
    return {
      id: this.id,
      username: this.username,
    };
  }

  getId(): string {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }
}
