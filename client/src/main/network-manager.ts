import { Signals } from "@shared/signals/signals";
import { io, Socket } from "socket.io-client";

export class NetworkManager {
  private static instance: NetworkManager;
  private socket!: Socket;

  private constructor() {}

  connect(serverUrl: string) {
    this.socket = io(serverUrl);
  }

  on(signal: Signals, callback: (data: any) => void) {
    if (!this.socket) {
      throw new Error("Socket not connected. Call connect() first.");
    }
    this.socket.on(signal, callback);
  }

  emit(signal: Signals, data?: any) {
    if (!this.socket) {
      throw new Error("Socket not connected. Call connect() first.");
    }
    this.socket.emit(signal, data);
  }

  public static getInstance() {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  getSocket() {
    return this.socket;
  }
}
