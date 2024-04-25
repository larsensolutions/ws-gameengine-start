export interface GameState {
  read: boolean;
}

export interface EngineParts {
  start(): void;
  stop(): void;
  pause(): void;
  destrory(): void;
}

export enum EngineState {
  PAUSED,
  RUNNING,
  STOPPED,
}
