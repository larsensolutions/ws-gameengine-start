import { GameState, Vector, Timer } from "../../engine";
import { PizzaSlice } from "./pizzaslice";

export enum PizzaStates {
  START = "start",
  SPINNING = "spinning",
  ROAST_LOOSER = "roast_looser",
  CELEBRATE_WINNERS = "celebrate_winners",
  FINISHED = "finished",
}

const randomInsultsWhenLoosing = [
  { insult: "oh no, you lost and you are such a looser right now", voice: "Thomas" },
  { insult: "you smell like a fart", voice: "Tessa" },
  { insult: "you are just like Cato, you yellow swine ", voice: "Thomas" },
  { insult: "you are so far from getting wine, that you are a grape", voice: "Tessa" },
  { insult: "you are a looser, and you know it", voice: "Thomas" },
  { insult: "you should have been born in the Dark Ages; you look terrible in the light", voice: "Thomas" },
  { insult: "your birth certificate is an apology letter from the condom factory", voice: "Thomas" },
  { insult: "you are ugly, and that's OK, because I'm ugly too. But you are a looser", voice: "Thomas" },
  { insult: "your family tree must be a circle, because everybody on it is a clown", voice: "Thomas" },
  { insult: "your mother was a hamster and your father smelt of elderberries", voice: "Hattori" },
  { insult: "you are so old, even your memory is in black and white", voice: "Nora" },
  { insult: "you are so fat, when you wear a yellow raincoat people scream 'Taxi'", voice: "Sara" },
  { insult: "you are so old, when you were a kid rainbows were black and white", voice: "Fred" },
  { insult: "your family tree must be a cactus because everybody on it is a prick", voice: "Hattori" },
];

export class PizzaState implements GameState {
  pizzaslices: PizzaSlice[]; // A player represents a slice of the pizza

  pizzaorigo: Vector; // The center of the pizza
  sliceSelectorPin: Vector; // The pin, marker, that selects the slice
  currentRotationAngle: number = 0; // Speed in the context of a spinning wheel
  sliceWidth: number = 0; // The width of a slice in radians
  pizzaRadius: number = 200; // The radius of the pizza
  currentSliceIndex: number = -1; // The index of the slice that is currently updated
  currentLooser: PizzaSlice | undefined; // The slice that was selected when the wheel stopped spinning

  targetSlice: number = -1; // The slice that the wheel should stop at

  gamestate: PizzaStates = PizzaStates.START; // The current state of the wheel

  // Timers
  minimumSpinningTime: number = 4000; // Minimum time the wheel must spin before it can be stopped
  timerWaitForNextRound: Timer;
  timerSpin: Timer;

  ready: boolean = true;
  roast: string = "";
  insultCounter: number = 0;

  private constructor(pizzaslices: PizzaSlice[], pizzaorigo: Vector) {
    this.pizzaslices = pizzaslices;
    this.pizzaorigo = pizzaorigo;
    this.sliceSelectorPin = Vector.of(this.pizzaorigo.x, this.pizzaorigo.y - this.pizzaRadius);
    this.sliceWidth = (2 * Math.PI) / this.pizzaslices.length;
    this.timerWaitForNextRound = Timer.of(5000);
    this.timerSpin = Timer.of(10000);
  }

  public static of(pizzaslices: PizzaSlice[], pizzaorigo: Vector): PizzaState {
    return new PizzaState(pizzaslices, pizzaorigo);
  }

  public getRandomRoast(): { insult: string; voice: string } {
    return randomInsultsWhenLoosing[this.insultCounter++ % randomInsultsWhenLoosing.length];
    //return randomInsultsWhenLoosing[Math.floor(Math.random() * randomInsultsWhenLoosing.length)];
  }
}
