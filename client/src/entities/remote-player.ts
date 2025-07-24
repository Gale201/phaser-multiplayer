import Phaser from "phaser";
import { Box } from "../utils/box";

export class RemotePlayer {
  private id: string;
  private scene: Phaser.Scene;
  private serverPosition: Phaser.Math.Vector2;
  private renderPosition: Phaser.Math.Vector2;
  private hitbox: Box;
  private username: string;
  private sprite!: Phaser.GameObjects.Sprite;
  private usernameText!: Phaser.GameObjects.Text;

  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  constructor(scene: Phaser.Scene, hitbox: Box, id: string, username: string) {
    this.scene = scene;
    this.id = id;
    this.username = username;
    this.serverPosition = new Phaser.Math.Vector2(hitbox.x, hitbox.y);
    this.renderPosition = new Phaser.Math.Vector2(hitbox.x, hitbox.y);
    this.hitbox = hitbox;
  }

  create() {
    this.sprite = this.scene.add.sprite(
      this.renderPosition.x,
      this.renderPosition.y,
      "baco-idle"
    );
    this.sprite.setOrigin(0.5, 0.5);
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
    this.usernameText.setOrigin(0.5);
  }

  update(delta: number) {
    if (this.velocity.x > 0) {
      this.sprite.play("player-walk-right", true);
    } else if (this.velocity.x < 0) {
      this.sprite.play("player-walk-left", true);
    } else if (this.velocity.length() !== 0) {
      this.sprite.play(
        `player-walk-${this.sprite.anims.currentAnim!.key.split("-")[2]}`,
        true
      );
    }

    if (!this.sprite.anims.currentAnim) {
      this.sprite.play("player-idle-right", true);
    }

    if (this.velocity.length() === 0) {
      this.sprite.play(
        `player-idle-${this.sprite.anims.currentAnim!.key.split("-")[2]}`,
        true
      );
    }

    this.move();

    this.sprite.setDepth(this.renderPosition.y);
    this.usernameText.setDepth(this.renderPosition.y);
  }

  move() {
    this.renderPosition.lerp(this.serverPosition, 0.2);

    this.sprite.setPosition(
      Math.round(this.renderPosition.x) + this.hitbox.w / 2,
      Math.round(this.renderPosition.y) - this.sprite.height - this.hitbox.h / 2
    );
    this.usernameText.setPosition(
      Math.round(this.renderPosition.x),
      Math.round(this.renderPosition.y - 96)
    );
  }

  destroy() {
    this.sprite.destroy();
    this.usernameText.destroy();
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

  getHitbox() {
    return this.hitbox;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setPosition(x: number, y: number) {
    this.serverPosition.set(x, y);
  }

  setVelocity(x: number, y: number) {
    this.velocity = new Phaser.Math.Vector2(x, y);
  }

  setHitbox(hitbox: Box) {
    this.hitbox = hitbox;
  }
}
