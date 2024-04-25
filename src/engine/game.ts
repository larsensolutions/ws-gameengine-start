import { GameGraphics } from "./graphics";
import { GameLoop } from "./loop";
import { GameInput } from "./input";
import { EventBus } from "./events";
import { EnginePart, EngineState, GameState } from "./types";

export abstract class GameEngine<State extends GameState> implements EnginePart {
  title: string;

  // Game engine parts
  graphics: GameGraphics;
  loop: GameLoop;
  input: GameInput;

  engineState: EngineState;
  state: State;

  events: EventBus;

  constructor(canvas: HTMLCanvasElement, title: string) {
    this.title = title;
    this.events = EventBus.Of();
    this.graphics = GameGraphics.of(canvas);
    this.loop = GameLoop.of(this);
    this.input = GameInput.of(this.events, canvas);

    this.engineState = EngineState.STOPPED;
    this.state = this.initState();
  }

  // A game must implement these methods
  abstract initState(): State;
  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract update(deltaTime: number): void;

  // Game engine controls

  public start() {
    console.log(`${this.title} has started!`);
    this.loop.start();
    this.engineState = EngineState.RUNNING;
    this.events.emit("start", {});
    console.log(this.state);
  }

  public pause() {
    this.loop.pause();
    this.engineState = EngineState.PAUSED;
    this.events.emit("pause");

    console.log(`${this.title} has paused!`);
  }

  public stop() {
    this.loop.stop();
    this.engineState = EngineState.STOPPED;

    console.log(`${this.title} has stopped!`);
  }

  public destroy(): void {
    this.loop.stop();
    this.graphics.destroy();
    this.input.destroy();
    this.engineState = EngineState.STOPPED;

    this.events.emit("destroyed");
    console.log(`${this.title} destroyed!`);
  }

  public getEngineState(): EngineState {
    return this.engineState;
  }
}
