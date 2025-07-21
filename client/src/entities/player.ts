import Phaser from "phaser";
import { GameScene } from "../main/game";
import { Signals } from "@shared/signals/signals";

export class Player {
  private id: string;
  private scene: GameScene;
  private position: Phaser.Math.Vector2;
  private username: string;

  private sprite!: Phaser.GameObjects.Sprite;
  private keys: any;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    id: string,
    username: string
  ) {
    this.scene = scene;
    this.id = id;
    this.position = new Phaser.Math.Vector2(x, y);
    this.username = username;
  }

  create() {
    this.sprite = this.scene.add.sprite(
      this.position.x,
      this.position.y,
      "baco-idle"
    );
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

  update(delta: number) {
    let direction = new Phaser.Math.Vector2();

    if (this.keys.D.isDown) {
      direction.x += 1;
      this.sprite.play("player-walk-right", true);
    } else if (this.keys.A.isDown) {
      direction.x -= 1;
      this.sprite.play("player-walk-left", true);
    }
    if (this.keys.W.isDown) {
      direction.y -= 1;
    } else if (this.keys.S.isDown) {
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

    this.scene
      .getNetworkManager()
      .emit(Signals.SET_PLAYER_DIRECTION, direction);
  }

  setPosition(x: number, y: number) {
    if (!this.sprite) return;

    this.position.set(x, y);
    this.sprite.setPosition(Math.round(x), Math.round(y));
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

  getX() {
    return this.sprite.x;
  }

  getY() {
    return this.sprite.y;
  }
}
