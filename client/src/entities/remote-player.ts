import Phaser from "phaser";

export class RemotePlayer {
  private id: string;
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private keys: any;

  private playerSpeed: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
    this.scene = scene;
    this.id = id;

    this.sprite = scene.add.sprite(x, y, "baco-idle");
    this.sprite.setOrigin(0.5, 0.5);

    this.createAnimations();
    this.sprite.play("player-idle-right");

    this.sprite.setScale(3);
  }

  private createAnimations() {
    const anims = this.scene.anims;

    anims.create({
      key: "player-idle-left",
      frames: anims.generateFrameNumbers("player-idle-left", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "player-idle-right",
      frames: anims.generateFrameNumbers("player-idle-right", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "player-walk-left",
      frames: anims.generateFrameNumbers("player-walk-left", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: "player-walk-right",
      frames: anims.generateFrameNumbers("player-walk-right", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update(delta: number) {}

  getSprite() {
    return this.sprite;
  }

  getId() {
    return this.id;
  }
}
