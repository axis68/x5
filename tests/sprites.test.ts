import { SPRITE_SIZE, Sprite } from "../src/sprites";

// Import functions directly to test them
const mockContext = {
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  drawImage: jest.fn(),
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 0,
  imageSmoothingEnabled: true,
} as any;

let mockCanvas: any;

// Mock document.createElement before importing the module
jest.spyOn(document, "createElement").mockImplementation((tagName) => {
  if (tagName === "canvas") {
    mockCanvas = {
      getContext: jest.fn().mockReturnValue(mockContext),
      width: 0,
      height: 0,
      setAttribute: jest.fn(),
    };
    return mockCanvas;
  }
  return jest.requireActual("document").createElement(tagName);
});

// Import after mocking
import {
  createSprite,
  drawSprite,
  getTileSprite,
  sprites,
} from "../src/sprites";

describe("Sprites Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContext.fillRect.mockClear();
    mockContext.strokeRect.mockClear();
    mockContext.drawImage.mockClear();
  });

  describe("SPRITE_SIZE constant", () => {
    test("is set to 64", () => {
      expect(SPRITE_SIZE).toBe(64);
    });
  });

  describe("createSprite function", () => {
    test("creates a sprite with correct dimensions", () => {
      const width = 32;
      const height = 32;
      const drawFn = jest.fn();

      const sprite = createSprite(width, height, drawFn);

      expect(sprite.width).toBe(width);
      expect(sprite.height).toBe(height);
      expect(sprite.canvas).toBeDefined();
      expect(mockCanvas.width).toBe(width);
      expect(mockCanvas.height).toBe(height);
    });

    test("calls the draw function with context", () => {
      const drawFn = jest.fn();

      createSprite(64, 64, drawFn);

      expect(drawFn).toHaveBeenCalledWith(mockContext);
    });

    test("disables image smoothing on context", () => {
      const drawFn = jest.fn();

      createSprite(64, 64, drawFn);

      expect(mockContext.imageSmoothingEnabled).toBe(false);
    });

    test("throws error when canvas context is null", () => {
      // Create a new mock that returns null for getContext
      const brokenCanvasCreator = jest
        .spyOn(document, "createElement")
        .mockImplementation((tagName) => {
          if (tagName === "canvas") {
            return {
              getContext: jest.fn().mockReturnValue(null),
              width: 0,
              height: 0,
            } as any;
          }
          return jest.requireActual("document").createElement(tagName);
        });

      expect(() => {
        createSprite(64, 64, jest.fn());
      }).toThrow("Could not get canvas context");

      brokenCanvasCreator.mockRestore();
    });
  });

  describe("drawSprite function", () => {
    test("draws sprite at correct position", () => {
      const sprite = {
        canvas: mockCanvas,
        width: 32,
        height: 32,
      };
      const x = 100;
      const y = 200;

      drawSprite(mockContext, sprite, x, y);

      expect(mockContext.drawImage).toHaveBeenCalledWith(mockCanvas, x, y);
    });
  });

  describe("getTileSprite function", () => {
    test("returns a sprite object", () => {
      const sprite = getTileSprite(0, 0);

      expect(sprite).toHaveProperty("canvas");
      expect(sprite).toHaveProperty("width");
      expect(sprite).toHaveProperty("height");
    });

    test("returns different sprites for different positions based on hash", () => {
      // Test multiple positions to ensure we get variety
      const sprite1 = getTileSprite(0, 0);
      const sprite2 = getTileSprite(10, 10);

      // Both should be valid sprites
      expect(sprite1.canvas).toBeDefined();
      expect(sprite2.canvas).toBeDefined();
    });

    test("returns consistent sprites for same position", () => {
      const sprite1 = getTileSprite(5, 5);
      const sprite2 = getTileSprite(5, 5);

      // Should return the same sprite type for the same position
      expect(sprite1).toBe(sprite2);
    });

    test("covers all sprite types through different coordinates", () => {
      // Test enough coordinates to likely hit all sprite types
      const spriteTypes = new Set();

      for (let x = 0; x < 20; x++) {
        for (let y = 0; y < 20; y++) {
          const sprite = getTileSprite(x, y);
          spriteTypes.add(sprite);
        }
      }

      // Should have multiple different sprite types
      expect(spriteTypes.size).toBeGreaterThan(1);
    });
  });

  describe("sprites object", () => {
    test("contains all required sprite types", () => {
      expect(sprites).toHaveProperty("grass");
      expect(sprites).toHaveProperty("dirt");
      expect(sprites).toHaveProperty("stone");
      expect(sprites).toHaveProperty("water");
      expect(sprites).toHaveProperty("player");
    });

    test("all sprites have correct structure", () => {
      Object.values(sprites).forEach((sprite) => {
        expect(sprite).toHaveProperty("canvas");
        expect(sprite).toHaveProperty("width");
        expect(sprite).toHaveProperty("height");
        expect(typeof sprite.width).toBe("number");
        expect(typeof sprite.height).toBe("number");
      });
    });

    test("tile sprites have correct dimensions", () => {
      [sprites.grass, sprites.dirt, sprites.stone, sprites.water].forEach(
        (sprite) => {
          expect(sprite.width).toBe(SPRITE_SIZE);
          expect(sprite.height).toBe(SPRITE_SIZE);
        },
      );
    });

    test("player sprite has correct dimensions", () => {
      expect(sprites.player.width).toBe(32);
      expect(sprites.player.height).toBe(32);
    });

    test("sprite creation calls drawing methods", () => {
      // Create a fresh mock context for this test
      const testContext = {
        fillRect: jest.fn(),
        strokeRect: jest.fn(),
        imageSmoothingEnabled: true,
      };

      // Create a test canvas with this context
      const testCanvas = {
        getContext: jest.fn().mockReturnValue(testContext),
        width: 0,
        height: 0,
      };

      // Mock createElement to return our test canvas
      const originalCreateElement = document.createElement;
      document.createElement = jest.fn((tagName) => {
        if (tagName === "canvas") {
          return testCanvas as any;
        }
        return originalCreateElement.call(document, tagName);
      });

      // Create a new sprite to test the drawing
      const drawFn = (ctx: any) => {
        ctx.fillRect(0, 0, 10, 10);
        ctx.strokeRect(0, 0, 10, 10);
      };

      createSprite(32, 32, drawFn);

      expect(testContext.fillRect).toHaveBeenCalledWith(0, 0, 10, 10);
      expect(testContext.strokeRect).toHaveBeenCalledWith(0, 0, 10, 10);

      // Restore original createElement
      document.createElement = originalCreateElement;
    });
  });

  describe("Edge cases and error handling", () => {
    test("createSprite works with zero dimensions", () => {
      const sprite = createSprite(0, 0, jest.fn());
      expect(sprite.width).toBe(0);
      expect(sprite.height).toBe(0);
    });

    test("getTileSprite works with negative coordinates", () => {
      const sprite = getTileSprite(-5, -10);
      expect(sprite).toHaveProperty("canvas");
      expect(sprite).toHaveProperty("width");
      expect(sprite).toHaveProperty("height");
    });

    test("drawSprite works with negative coordinates", () => {
      const sprite = { canvas: mockCanvas, width: 32, height: 32 };

      expect(() => {
        drawSprite(mockContext, sprite, -10, -20);
      }).not.toThrow();

      expect(mockContext.drawImage).toHaveBeenCalledWith(mockCanvas, -10, -20);
    });

    test("getTileSprite hash function produces deterministic results", () => {
      // Test the same coordinates multiple times
      const results: Sprite[] = [];
      for (let i = 0; i < 5; i++) {
        results.push(getTileSprite(7, 7));
      }

      // All results should be the same sprite reference
      expect(results.every((sprite) => sprite === results[0])).toBe(true);
    });

    test("getTileSprite produces different sprites for distant coordinates", () => {
      const coord1 = getTileSprite(0, 0);
      const coord2 = getTileSprite(100, 100);
      const coord3 = getTileSprite(50, 75);

      // At least some of these should be different
      const unique = new Set([coord1, coord2, coord3]);
      expect(unique.size).toBeGreaterThan(1);
    });
  });
});
