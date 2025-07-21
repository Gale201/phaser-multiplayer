import Phaser from "phaser";

export class RemotePlayer {
  private id: string;
  private scene: Phaser.Scene;
  private position: Phaser.Math.Vector2;
  private username: string;
  private sprite!: Phaser.GameObjects.Sprite;

  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: string,
    username: string
  ) {
    this.scene = scene;
    this.id = id;
    this.username = username;
    this.position = new Phaser.Math.Vector2(x, y);
  }

  create() {
    this.sprite = this.scene.add.sprite(
      this.position.x,
      this.position.y,
      "baco-idle"
    );
    this.sprite.setOrigin(0.5, 0.5);

    // this.createAnimations();
    this.sprite.play("player-idle-right");

    this.sprite.setScale(3);
  }

  /*   private createAnimations() {
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
  } */

  update(delta: number) {}

  setPosition(x: number, y: number) {
    this.position.set(x, y);
    this.sprite.setPosition(x, y);
  }

  getSprite() {
    return this.sprite;
  }

  getId() {
    return this.id;
  }

  getUsername() {
    return this.username;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setVelocity(x: number, y: number) {
    this.velocity = new Phaser.Math.Vector2(x, y);
  }
}
