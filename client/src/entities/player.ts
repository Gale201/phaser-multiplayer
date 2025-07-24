import Phaser from "phaser";
import { GameScene } from "../main/game";
import { Signals } from "@shared/signals/signals";
import { Box } from "../utils/box";

export class Player {
  private id: string;
  private scene: GameScene;
  private serverPosition: Phaser.Math.Vector2;
  private renderPosition: Phaser.Math.Vector2;
  private hitbox: Box;
  private username: string;

  private sprite!: Phaser.GameObjects.Sprite;
  private keys: any;

  private usernameText!: Phaser.GameObjects.Text;

  constructor(scene: GameScene, hitbox: Box, id: string, username: string) {
    this.scene = scene;
    this.id = id;
    this.serverPosition = new Phaser.Math.Vector2(hitbox.x, hitbox.y);
    this.renderPosition = new Phaser.Math.Vector2(hitbox.x, hitbox.y);
    this.hitbox = hitbox;
    this.username = username;
  }

  create() {
    this.sprite = this.scene.add.sprite(
      this.serverPosition.x,
      this.serverPosition.y,
      "baco-idle"
    );
    // this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setScale(3);

    this.usernameText = this.scene.add.text(
      this.serverPosition.x,
      this.serverPosition.y - 60,
      this.username,
      {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#000000",
        align: "center",
        resolution: 2,
      }
    );
    // this.usernameText.setOrigin(0.5);

    this.keys = this.scene.input.keyboard!.addKeys("W,A,S,D");
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

    if (!this.sprite.anims.currentAnim) {
      this.sprite.play("player-idle-right", true);
    }

    if (direction.length() === 0) {
      this.sprite.play(
        `player-idle-${this.sprite.anims.currentAnim!.key.split("-")[2]}`,
        true
      );
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

    this.move();

    this.sprite.setDepth(this.renderPosition.y);
    this.usernameText.setDepth(this.renderPosition.y);
  }

  move() {
    this.renderPosition.lerp(this.serverPosition, 0.2);

    this.sprite.setPosition(
      Math.round(this.renderPosition.x + this.hitbox.w / 2),
      Math.round(this.renderPosition.y - this.sprite.height - this.hitbox.h / 2)
    );
    this.usernameText.setPosition(
      this.renderPosition.x + this.hitbox.w / 2 - this.usernameText.width / 2,
      this.renderPosition.y - 110
    );
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

  getHitbox() {
    return this.hitbox;
  }

  setPosition(x: number, y: number) {
    this.serverPosition.set(x, y);
  }

  setHitbox(hitbox: Box) {
    this.hitbox = hitbox;
  }
}
