export interface GameState {
  ready: boolean;
}

export interface EnginePart {
  start(): void;
  pause(): void;
  stop(): void;
  destroy(): void;
}

export enum EngineState {
  PAUSED,
  RUNNING,
  STOPPED,
}
