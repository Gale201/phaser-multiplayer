import { Socket } from "socket.io";
import { Serializable } from "../utils/serializable";
import { Signals } from "@shared/signals/signals";

export class Player implements Serializable {
  private readonly id: string;
  private readonly socket: Socket;
  private username: string;

  constructor(socket: Socket, username: string) {
    this.socket = socket;
    this.username = username;

    this.id = socket.id;
  }

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
