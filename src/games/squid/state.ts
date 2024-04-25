import { Entity, GameState, Timer, Vector, loadFromAssets } from "../../engine";
import { imageMap } from "./data";
import { Tile } from "./tile";
import { Sprite } from "./sprite";
import { Emitter } from "./emitter";

export enum SquidStates {
  RUN_FOR_YOUR_LIFE = "run",
  STOP_OR_BE_KILLED = "stop",
  KILL_THE_DISOBEDIENT = "kill",
  ELIMINATE_LOOSERS = "eliminate",
  SHOW_WINNER = "show_winner",
  SHOW_LOOSER = "show_looser",
  FINISHED = "finished",
}

export class SquidState implements GameState {
  tileSize: Vector = Vector.of(60, 30); // default tile size
  images: HTMLImageElement[] = [];
  numberOfTiles: number = 16;
  floor: Tile[][];
  floorElements: Entity<GameState>[];
  center: Tile;
  gamestate: SquidStates = SquidStates.RUN_FOR_YOUR_LIFE;
  screenCenter: Vector;
  redlightgreenlightTimer: Timer;
  runningTimer: Timer;
  emitter: Emitter;

  private constructor(screenCenter: Vector) {
    this.screenCenter = screenCenter;
    this.floor = [];
    this.floorElements = [];
    this.center = Tile.Empty;
    this.emitter = Emitter.of(this.generateIsometricPosition(8, 8), 1000, 5000);
    this.redlightgreenlightTimer = Timer.empty();
    this.runningTimer = Timer.empty();
    this.loadAssets();
  }
  ready: boolean = false;

  async loadAssets() {
    this.images = await loadFromAssets([
      "green",
      "tree_cluster",
      "tree_cluster_small",
      "tree_medium",
      "player",
      "tree_sphere_blue_opposite",
      "blue",
      "blue2",
      "blue3",
      "blue4",
    ]);
    this.center = Tile.of(this.generateIsometricPosition(8, 8), this.images[5], this.tileSize);

    for (let i = 0; i < this.numberOfTiles; i++) {
      this.floor[i] = [];
      for (let j = 0; j < this.numberOfTiles; j++) {
        this.floor[i][j] = Tile.of(this.generateIsometricPosition(i, j), this.images[imageMap[i][j]], this.tileSize);
      }
    }

    this.floorElements.push(this.center);
    this.floorElements.push(Tile.of(this.generateIsometricPosition(11, 4), this.images[1], this.tileSize));
    this.floorElements.push(Tile.of(this.generateIsometricPosition(11, 3), this.images[2], this.tileSize));
    this.floorElements.push(Tile.of(this.generateIsometricPosition(10, 3), this.images[3], this.tileSize));
    this.floorElements.push(Tile.of(this.generateIsometricPosition(10, 4), this.images[1], this.tileSize));
    this.floorElements.push(Tile.of(this.generateIsometricPosition(1, 2), this.images[1], this.tileSize));
    this.floorElements.push(Tile.of(this.generateIsometricPosition(1, 3), this.images[2], this.tileSize));
    this.floorElements.push(Tile.of(this.generateIsometricPosition(0, 2), this.images[3], this.tileSize));

    this.floorElements.push(Sprite.of(this.generateIsometricPosition(0, 0), this.images[4], true));
    this.floorElements.push(Sprite.of(this.generateIsometricPosition(0, 5), this.images[4], true));
    this.floorElements.push(Sprite.of(this.generateIsometricPosition(0, 10), this.images[4], true));
    this.floorElements.push(Sprite.of(this.generateIsometricPosition(0, 15), this.images[4], true));

    this.floorElements.push(Sprite.of(this.generateIsometricPosition(5, 0), this.images[4], true));
    this.floorElements.push(Sprite.of(this.generateIsometricPosition(5, 15), this.images[4], true));

    this.floorElements.push(Sprite.of(this.generateIsometricPosition(10, 0), this.images[4], true));
    this.floorElements.push(Sprite.of(this.generateIsometricPosition(10, 15), this.images[4], true));

    this.floorElements.push(Sprite.of(this.generateIsometricPosition(15, 0), this.images[4], true));
    this.floorElements.push(Sprite.of(this.generateIsometricPosition(15, 5), this.images[4], true));
    this.floorElements.push(Sprite.of(this.generateIsometricPosition(15, 10), this.images[4], true));
    this.floorElements.push(Sprite.of(this.generateIsometricPosition(15, 15), this.images[4], true));

    // Now the engine will start to update and draw the game
    this.ready = true;
  }

  public generateIsometricPosition(x: number, y: number): Vector {
    const isoX = (x * this.tileSize.x) / 2 - (y * this.tileSize.x) / 2 - this.tileSize.x / 2;
    const isoY = (x * this.tileSize.y) / 2 + (y * this.tileSize.y) / 2 - this.tileSize.y / 2;
    return Vector.of(isoX + this.screenCenter.x, isoY + this.screenCenter.y / 2);
  }

  public static of(screenCenter: Vector): SquidState {
    return new SquidState(screenCenter);
  }
}
