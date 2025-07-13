import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("App Component", () => {
  test("renders the game title", () => {
    render(<App />);
    const titleElement = screen.getByText("x5 Game");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe("H1");
  });

  test("renders the Game component", () => {
    render(<App />);
    // Check if canvas is rendered (Game component renders a canvas)
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas?.tagName).toBe("CANVAS");
  });

  test("has correct app structure and styling classes", () => {
    const { container } = render(<App />);
    const appDiv = container.querySelector(".app");
    expect(appDiv).toBeInTheDocument();
  });

  test("renders game instructions", () => {
    render(<App />);
    const instructions = screen.getByText(
      "Use arrow keys to move the red player character",
    );
    expect(instructions).toBeInTheDocument();
  });

  test("canvas has correct dimensions", () => {
    render(<App />);
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveAttribute("width", "800");
    expect(canvas).toHaveAttribute("height", "600");
  });
});
