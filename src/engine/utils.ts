import { Entity } from "./entity";
import { GameState } from "./types";

export const assetsToImages = (paths: string[]) =>
  Promise.all(
    paths.map(
      (path) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = path;
        })
    )
  );

export const loadFromAssets = (partialPaths: string[]) =>
  Promise.all(
    partialPaths.map(
      (partialPath) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = (e) => {
            console.log(e);
            reject();
          };
          const imagePath = `../assets/${partialPath}.png`;
          image.src = new URL(imagePath, import.meta.url).href;
        })
    )
  );

export const sortOnPositionY = (entities: Entity<GameState>[]) => entities.sort((a, b) => a.depth() - b.depth());

export const isNumberBetween = (value: number, min: number, max: number) => value >= min && value <= max;

// Returns the angle in degrees adjusted to the canvas coordinate system 90 deg NORTH, 0 deg EAST, 270 deg SOUTH, 180 deg WEST
export const getAngleInDegreesAdjusted = (angleRadians: number): number => (360 - (angleRadians * 180) / Math.PI) % 360;

export const getRandomWithinRange = (min: number, max: number) => Math.random() * (max - min) + min;
