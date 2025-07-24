import { Box } from "./box";

export class HitboxDebugger {
  private scene: Phaser.Scene;
  private hitboxes: Box[] = [];
  private graphics!: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.graphics = this.scene.add.graphics();
    this.graphics.setDepth(Infinity);
  }

  update() {
    if (!this.graphics) {
      console.warn("HitboxDebugger graphics not created yet.");
      return;
    }

    this.graphics.clear();
    this.graphics.lineStyle(2, 0xff0000, 1);
    for (const hitbox of this.hitboxes) {
      this.graphics.strokeRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
    }

    this.hitboxes = [];
  }

  addHitbox(hitbox: Box) {
    this.hitboxes.push(hitbox);
  }
}
