import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;

  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {}

  update(time: number, delta: number) {}
}

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  backgroundColor: "#1d1d1d",
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
