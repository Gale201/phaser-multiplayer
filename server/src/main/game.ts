import { Server } from "socket.io";

export class Game {
  private readonly FPS = 60;
  private readonly server: Server;

  private running: boolean = false;
  private lastUpdateTime: number = performance.now();

  constructor(server: Server) {
    this.server = server;
    this.start();
  }

  private start() {
    this.running = true;
    this.lastUpdateTime = performance.now();
    this.gameLoop();
  }

  private gameLoop() {
    if (!this.running) return;

    const currentTime = performance.now();
    let deltaTime = currentTime - this.lastUpdateTime;

    this.update((deltaTime / 1000) * this.FPS);

    this.lastUpdateTime = currentTime;

    setTimeout(this.gameLoop.bind(this), 1000 / this.FPS);
  }

  private update(deltaTime: number) {}

  isRunning() {
    return this.running;
  }
}
