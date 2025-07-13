import { useEffect, useRef } from "react";
import { sprites, getTileSprite, drawSprite, SPRITE_SIZE } from "./sprites";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const PLAYER_SPEED = 2;

interface Position {
  x: number;
  y: number;
}

interface GameState {
  player: Position;
  camera: Position;
  keys: Set<string>;
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    player: { x: 0, y: 0 },
    camera: { x: 0, y: 0 },
    keys: new Set(),
  });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = CANVAS_WIDTH;
    offscreenCanvas.height = CANVAS_HEIGHT;
    offscreenCanvasRef.current = offscreenCanvas;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const offscreenCtx = offscreenCanvas.getContext("2d");

    if (!ctx || !offscreenCtx) return;

    // Disable image smoothing for pixel art
    ctx.imageSmoothingEnabled = false;
    offscreenCtx.imageSmoothingEnabled = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        gameStateRef.current.keys.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const update = () => {
      const gameState = gameStateRef.current;
      const { keys } = gameState;

      // Update player position based on keyboard input
      if (keys.has("ArrowUp")) gameState.player.y -= PLAYER_SPEED;
      if (keys.has("ArrowDown")) gameState.player.y += PLAYER_SPEED;
      if (keys.has("ArrowLeft")) gameState.player.x -= PLAYER_SPEED;
      if (keys.has("ArrowRight")) gameState.player.x += PLAYER_SPEED;

      // Update camera to follow player (player stays centered)
      gameState.camera.x = gameState.player.x - CANVAS_WIDTH / 2;
      gameState.camera.y = gameState.player.y - CANVAS_HEIGHT / 2;
    };

    const render = () => {
      const gameState = gameStateRef.current;

      // Clear offscreen canvas
      offscreenCtx.fillStyle = "#2a2a2a";
      offscreenCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Render background grid
      renderBackground(offscreenCtx, gameState.camera);

      // Render player at center of screen
      renderPlayer(offscreenCtx);

      // Copy offscreen canvas to main canvas (double buffering)
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(offscreenCanvas, 0, 0);
    };

    const renderBackground = (
      ctx: CanvasRenderingContext2D,
      camera: Position,
    ) => {
      const startTileX = Math.floor(camera.x / SPRITE_SIZE);
      const startTileY = Math.floor(camera.y / SPRITE_SIZE);
      const endTileX = Math.ceil((camera.x + CANVAS_WIDTH) / SPRITE_SIZE);
      const endTileY = Math.ceil((camera.y + CANVAS_HEIGHT) / SPRITE_SIZE);

      for (let tileX = startTileX; tileX <= endTileX; tileX++) {
        for (let tileY = startTileY; tileY <= endTileY; tileY++) {
          const x = tileX * SPRITE_SIZE - camera.x;
          const y = tileY * SPRITE_SIZE - camera.y;

          // Get the appropriate sprite for this tile position
          const tileSprite = getTileSprite(tileX, tileY);
          drawSprite(ctx, tileSprite, x, y);
        }
      }
    };

    const renderPlayer = (ctx: CanvasRenderingContext2D) => {
      const playerScreenX = CANVAS_WIDTH / 2 - 16;
      const playerScreenY = CANVAS_HEIGHT / 2 - 16;

      // Draw player sprite
      drawSprite(ctx, sprites.player, playerScreenX, playerScreenY);
    };

    const gameLoop = () => {
      update();
      render();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      <div className="game-instructions">
        Use arrow keys to move the red player character
      </div>
    </div>
  );
}
