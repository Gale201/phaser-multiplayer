import Phaser from "phaser";

export default class Player {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private keys: any;

  private playerSpeed: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    this.sprite = scene.add.sprite(x, y, "baco-idle");
    this.sprite.setOrigin(0.5, 0.5);

    this.createAnimations();
    this.sprite.play("player-idle-right");

    this.keys = this.scene.input.keyboard!.addKeys("W,A,S,D");

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

  public update(delta: number) {
    let direction = new Phaser.Math.Vector2();

    if (this.keys.D.isDown) {
      direction.x += 1;
      this.sprite.play("player-walk-right", true);
    }
    if (this.keys.A.isDown) {
      direction.x -= 1;
      this.sprite.play("player-walk-left", true);
    }
    if (this.keys.W.isDown) {
      direction.y -= 1;
    }
    if (this.keys.S.isDown) {
      direction.y += 1;
    }

    if (direction.length() === 0) {
      this.sprite.play(
        `player-idle-${this.sprite.anims.currentAnim!.key.split("-")[2]}`,
        true
      );
      return;
    } else if (direction.length() !== 0) {
      this.sprite.play(
        `player-walk-${this.sprite.anims.currentAnim!.key.split("-")[2]}`,
        true
      );
    }

    direction = direction.normalize();
    this.sprite.x += direction.x * this.playerSpeed * (delta / 1000);
    this.sprite.y += direction.y * this.playerSpeed * (delta / 1000);
  }

  getSprite() {
    return this.sprite;
  }
}
