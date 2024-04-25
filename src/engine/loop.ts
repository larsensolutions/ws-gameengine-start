import { GameEngine } from "./game";
import { EnginePart, GameState } from "./types";

export class GameLoop implements EnginePart {
  game: GameEngine<GameState>;
  animationFrame: number | undefined;

  running: boolean;
  lastTimestamp: number | undefined;
  deltaTime: number;

  private constructor(game: GameEngine<GameState>) {
    this.game = game;
    this.deltaTime = 0;
    this.running = false;
  }

  private updateGamestate() {
    this.game.graphics.translate(this.game.input.panOffset).zoom(this.game.input.zoom).transform();
    this.game.update(this.deltaTime);
    this.game.input.resetPanOffset();
  }

  private drawGamestate() {
    this.game.graphics.clear();
    this.game.draw(this.game.graphics.ctx);
  }

  private loop = (timestamp: number) => {
    // Ensure sync with the time provided by the browser and requestAnimationFrame
    if (this.lastTimestamp === undefined) {
      this.lastTimestamp = timestamp;
    }
    // requestAnimationFrame can queue up frames with the same timestamp
    if (this.lastTimestamp !== timestamp && this.game.state.ready) {
      this.deltaTime = timestamp - this.lastTimestamp!;
      this.updateGamestate();
      this.drawGamestate();
    }

    // Keep track of the last processed timestamp
    this.lastTimestamp = timestamp;

    // Continue the loop if game is running
    if (this.running) {
      this.animationFrame = window.requestAnimationFrame(this.loop);
    }
  };

  private clear() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
    this.lastTimestamp = undefined;
  }

  public start() {
    this.clear();
    this.running = true;
    this.animationFrame = window.requestAnimationFrame(this.loop);
  }
  public pause() {
    this.clear();
    this.running = false;
  }

  public stop() {
    this.clear();
    this.running = false;
  }

  destroy(): void {
    throw new Error("Method not implemented.");
  }

  static of(game: GameEngine<GameState>): GameLoop {
    return new GameLoop(game);
  }
}
