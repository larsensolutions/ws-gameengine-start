import { GameEngine, sortOnPositionY } from "../../engine";
import { SquidState, SquidStates } from "./state";

export class SquidGame extends GameEngine<SquidState> {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas, "Squid Game");
  }

  initState(): SquidState {
    return SquidState.of(this.graphics.center);
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this.state.floor.length; i++) {
      for (let j = 0; j < this.state.floor[i].length; j++) {
        this.state.floor[i][j].update(deltaTime, this.state);
      }
    }
    for (let i = 0; i < this.state.floorElements.length; i++) {
      this.state.floorElements[i].update(deltaTime, this.state);
    }
    sortOnPositionY(this.state.floorElements);
    this.state.emitter.update(deltaTime, this.state);

    switch (this.state.gamestate) {
      case SquidStates.RUN_FOR_YOUR_LIFE:
        if (this.state.runningTimer.isDone()) {
          this.state.gamestate = SquidStates.STOP_OR_BE_KILLED;
        }
        break;
      case SquidStates.STOP_OR_BE_KILLED:
        this.state.emitter.reset();
        this.state.gamestate = SquidStates.KILL_THE_DISOBEDIENT;
        break;
      case SquidStates.KILL_THE_DISOBEDIENT:
        if (this.state.emitter.isDone()) {
          this.state.gamestate = SquidStates.ELIMINATE_LOOSERS;
        }
        break;
      case SquidStates.ELIMINATE_LOOSERS:
        this.state.runningTimer.reset();
        this.state.gamestate = SquidStates.RUN_FOR_YOUR_LIFE;
        break;
    }

    this.state.redlightgreenlightTimer.update(deltaTime);
    this.state.runningTimer.update(deltaTime);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.state.floor.length; i++) {
      for (let j = 0; j < this.state.floor[i].length; j++) {
        this.state.floor[i][j].draw(ctx);
      }
    }
    this.state.emitter.draw(ctx);
    for (let i = 0; i < this.state.floorElements.length; i++) {
      this.state.floorElements[i].draw(ctx);
    }
    //this.state.floor[0][0].drawDot(ctx);
  }
}
