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

    if (this.hitboxes.length !== 0) {
      this.graphics.clear();
    }
    this.graphics.lineStyle(2, 0xff0000, 1);
    for (const hitbox of this.hitboxes) {
      if (this.hitboxIsInScreen(hitbox))
        this.graphics.strokeRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
    }

    this.hitboxes = [];
  }

  addHitbox(hitbox: Box) {
    this.hitboxes.push(hitbox);
  }

  hitboxIsInScreen(hitbox: Box): boolean {
    const camera = this.scene.cameras.main;
    return (
      hitbox.x + hitbox.w > camera.scrollX &&
      hitbox.x < camera.scrollX + camera.width &&
      hitbox.y + hitbox.h > camera.scrollY &&
      hitbox.y < camera.scrollY + camera.height
    );
  }
}
