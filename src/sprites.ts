export const SPRITE_SIZE = 64;

export interface Sprite {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

// Global variable to store the loaded tileset image
let tilesetImage: HTMLImageElement | null = null;
let tilesetLoaded = false;

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

// Load the tileset image
export function loadTileset(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (tilesetLoaded && tilesetImage) {
      console.log('Tileset already loaded');
      resolve();
      return;
    }

    console.log('Loading tileset from /material1.png');
    const img = new Image();
    img.onload = () => {
      console.log('Tileset image loaded successfully:', img.width, 'x', img.height);
      tilesetImage = img;
      tilesetLoaded = true;
      // Recreate sprites once the image is loaded
      initializeSpritesFromTileset();
      console.log('Sprites updated from tileset');
      resolve();
    };
    img.onerror = (error) => {
      console.error('Failed to load tileset image:', error);
      reject(new Error('Failed to load tileset image'));
    };
    img.src = './material1.png';
  });
}

// Extract a tile from the tileset image
function extractTileFromTileset(
  tileX: number,
  tileY: number,
  tileSize?: number
): Sprite {
  if (!tilesetImage) {
    throw new Error('Tileset not loaded');
  }

  // Auto-detect tile size if not provided
  if (!tileSize) {
    // Assume the tileset has at least 4 tiles horizontally
    tileSize = Math.floor(tilesetImage.width / 4);
  }

  console.log(`Extracting tile (${tileX}, ${tileY}) with size ${tileSize} from image ${tilesetImage.width}x${tilesetImage.height}`);

  return createSprite(SPRITE_SIZE, SPRITE_SIZE, (ctx) => {
    try {
      ctx.drawImage(
        tilesetImage!,
        tileX * tileSize!,
        tileY * tileSize!,
        tileSize!,
        tileSize!,
        0,
        0,
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    } catch (error) {
      console.error('Error drawing tile:', error);
      // Fallback: draw a colored rectangle
      ctx.fillStyle = tileX === 0 ? '#228B22' : tileX === 1 ? '#8B4513' : tileX === 2 ? '#708090' : '#4682B4';
      ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    }
  });
}

// Initialize sprites with fallback colors (will be replaced when tileset loads)
export let sprites = {
  grass: createSprite(SPRITE_SIZE, SPRITE_SIZE, (ctx) => {
    // Fallback grass color
    ctx.fillStyle = "#228B22";
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  }),
  dirt: createSprite(SPRITE_SIZE, SPRITE_SIZE, (ctx) => {
    // Fallback dirt color
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  }),
  stone: createSprite(SPRITE_SIZE, SPRITE_SIZE, (ctx) => {
    // Fallback stone color
    ctx.fillStyle = "#708090";
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  }),
  water: createSprite(SPRITE_SIZE, SPRITE_SIZE, (ctx) => {
    // Fallback water color
    ctx.fillStyle = "#4682B4";
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
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

// Function to initialize sprites from the tileset
export function initializeSpritesFromTileset(): void {
  if (!tilesetImage) {
    console.warn('Tileset image not loaded, cannot initialize sprites');
    return;
  }

  console.log('Initializing sprites from tileset...');
  
  try {
    // Assuming the tileset is organized in a grid, extract tiles
    // You may need to adjust these coordinates based on your actual tileset layout
    sprites.grass = extractTileFromTileset(0, 0); // Top-left tile
    sprites.dirt = extractTileFromTileset(1, 0);  // Second tile in first row
    sprites.stone = extractTileFromTileset(2, 0); // Third tile in first row
    sprites.water = extractTileFromTileset(3, 0); // Fourth tile in first row
    // Keep the original player sprite
    
    console.log('Sprites successfully updated from tileset');
  } catch (error) {
    console.error('Error initializing sprites from tileset:', error);
  }
}

export function getTileSprite(x: number, y: number): Sprite {
  // Simple procedural tile selection based on position
  const hash = Math.abs(x * 73856093 + y * 19349663) % 100;

  if (hash < 60) return sprites.grass;
  if (hash < 80) return sprites.dirt;
  if (hash < 95) return sprites.stone;
  return sprites.water;
}

export function isTileSolid(x: number, y: number): boolean {
  // Get the tile sprite to determine its type
  const tileSprite = getTileSprite(x, y);
  
  // Stone and water are solid (impassable)
  return tileSprite === sprites.stone || tileSprite === sprites.water;
}

export function findSafeSpawnPosition(): { x: number; y: number } {
  // Start from origin and spiral outward to find a safe position
  let radius = 0;
  const maxRadius = 100; // Maximum search radius
  
  while (radius < maxRadius) {
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        // Only check the edge of the current radius to avoid redundant checks
        if (Math.abs(x) === radius || Math.abs(y) === radius || radius === 0) {
          if (!isTileSolid(x, y)) {
            // Found a safe tile, return world coordinates (center of tile)
            return {
              x: x * SPRITE_SIZE + SPRITE_SIZE / 2,
              y: y * SPRITE_SIZE + SPRITE_SIZE / 2
            };
          }
        }
      }
    }
    radius++;
  }
  
  // Fallback: if no safe position found, return a far position that's likely to be grass
  return { x: 1000, y: 1000 };
}