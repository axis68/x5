export const SPRITE_SIZE = 64;

export interface Sprite {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export function createSprite(
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D) => void,
): Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.imageSmoothingEnabled = false;
  drawFn(ctx);

  return {
    canvas,
    width,
    height,
  };
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
): void {
  ctx.drawImage(sprite.canvas, x, y);
}

export const sprites = {
  grass: createSprite(SPRITE_SIZE, SPRITE_SIZE, (ctx) => {
    // Base grass color
    ctx.fillStyle = "#228B22";
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

    // Add some grass texture
    ctx.fillStyle = "#32CD32";
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * SPRITE_SIZE;
      const y = Math.random() * SPRITE_SIZE;
      ctx.fillRect(x, y, 2, 4);
    }

    // Add darker grass patches
    ctx.fillStyle = "#006400";
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * SPRITE_SIZE;
      const y = Math.random() * SPRITE_SIZE;
      ctx.fillRect(x, y, 3, 2);
    }
  }),

  dirt: createSprite(SPRITE_SIZE, SPRITE_SIZE, (ctx) => {
    // Base dirt color
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

    // Add dirt texture
    ctx.fillStyle = "#A0522D";
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * SPRITE_SIZE;
      const y = Math.random() * SPRITE_SIZE;
      ctx.fillRect(x, y, 2, 2);
    }

    // Add darker dirt spots
    ctx.fillStyle = "#654321";
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * SPRITE_SIZE;
      const y = Math.random() * SPRITE_SIZE;
      ctx.fillRect(x, y, 3, 3);
    }
  }),

  stone: createSprite(SPRITE_SIZE, SPRITE_SIZE, (ctx) => {
    // Base stone color
    ctx.fillStyle = "#708090";
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

    // Add stone texture
    ctx.fillStyle = "#778899";
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * SPRITE_SIZE;
      const y = Math.random() * SPRITE_SIZE;
      ctx.fillRect(x, y, 4, 4);
    }

    // Add darker cracks
    ctx.fillStyle = "#2F4F4F";
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * SPRITE_SIZE;
      const y = Math.random() * SPRITE_SIZE;
      ctx.fillRect(x, y, 1, 8);
    }
  }),

  water: createSprite(SPRITE_SIZE, SPRITE_SIZE, (ctx) => {
    // Base water color
    ctx.fillStyle = "#4682B4";
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

    // Add water waves
    ctx.fillStyle = "#87CEEB";
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * SPRITE_SIZE;
      const y = Math.random() * SPRITE_SIZE;
      ctx.fillRect(x, y, 8, 2);
    }

    // Add water highlights
    ctx.fillStyle = "#ADD8E6";
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * SPRITE_SIZE;
      const y = Math.random() * SPRITE_SIZE;
      ctx.fillRect(x, y, 4, 1);
    }
  }),

  player: createSprite(32, 32, (ctx) => {
    // Player body
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(8, 8, 16, 16);

    // Player outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 16, 16);

    // Simple face
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(10, 10, 2, 2); // Left eye
    ctx.fillRect(20, 10, 2, 2); // Right eye
    ctx.fillRect(14, 16, 4, 2); // Mouth
  }),
};

export function getTileSprite(x: number, y: number): Sprite {
  // Simple procedural tile selection based on position
  const hash = Math.abs(x * 73856093 + y * 19349663) % 100;

  if (hash < 60) return sprites.grass;
  if (hash < 80) return sprites.dirt;
  if (hash < 95) return sprites.stone;
  return sprites.water;
}
