import { GameEngine } from "../../engine";
import { PizzaSlice } from "./pizzaslice";
import { players } from "./data";
import { PizzaState, PizzaStates } from "./state";

export class PizzaGame extends GameEngine<PizzaState> {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas, "Pizza Game");
    this.graphics.ctx.font = "18px Arial";
  }

  initState(): PizzaState {
    return PizzaState.of(
      // Yes, we copy here, otherwise hot reload will just keep the modified data
      players.map((player) => PizzaSlice.of({ ...player })),
      this.graphics.center
    );
  }

  update(delta: number): void {
    switch (this.state.gamestate) {
      case PizzaStates.START:
        this.startUpdate();
        break;
      case PizzaStates.SPINNING:
        this.spinUpdate(delta);
        break;
      case PizzaStates.ROAST_LOOSER:
        this.roastLooser(delta);
        break;
      case PizzaStates.CELEBRATE_WINNERS:
        this.state.gamestate = PizzaStates.FINISHED;
        break;
      case PizzaStates.FINISHED:
        this.events.emit("state", this.state as never);
        this.pause();
        break;
    }
    // Update the players
    this.state.sliceWidth = (2 * Math.PI) / this.state.pizzaslices.filter((player) => player.options.tickets > 0).length;
    this.state.pizzaslices
      .filter((slice) => slice.options.tickets > 0)
      .forEach((slice, index) => {
        this.state.currentSliceIndex = index;
        slice.update(delta, this.state);
      });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "white";

    this.state.pizzaslices
      .filter((player) => player.options.tickets > 0)
      .forEach((player) => {
        //Draw inner pizza slice
        player.draw(ctx);

        // Draw outer pizza slice edges
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.state.pizzaorigo.x, this.state.pizzaorigo.y);
        ctx.lineTo(player.position.x, player.position.y);
        ctx.stroke();
        ctx.closePath();
      });

    // Draw the outer pizza edge
    ctx.beginPath();
    ctx.arc(this.state.pizzaorigo.x, this.state.pizzaorigo.y, 200, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    // Draw the slice selector pin
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.state.sliceSelectorPin.x, this.state.sliceSelectorPin.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  startUpdate() {
    //Randomly select a player to start the game that has tickets left
    //Yes, we are only creating a few variables every now and again here each round, so its not a performance issue
    const playersWithTickets = this.state.pizzaslices.filter((player) => player.options.tickets > 0);
    this.state.targetSlice = this.state.pizzaslices.indexOf(playersWithTickets[Math.floor(Math.random() * playersWithTickets.length)]);

    this.state.timerSpin.reset();
    this.state.timerSpin.setDurationFromTimestamp(new Date().getTime() + this.state.minimumSpinningTime);
    this.state.gamestate = PizzaStates.SPINNING;

    console.log(`Spin for ${this.state.pizzaslices[this.state.targetSlice].options.name}! `);
    this.events.emit("state", this.state as never);
  }

  spinUpdate(delta: number) {
    this.state.timerSpin.update(delta);
    // Update the rotation angle using a sine wave or something?
    this.state.currentRotationAngle += delta / 1000;
    this.state.currentLooser = this.state.pizzaslices.filter((slice) => slice.options.tickets > 0).sort((a, b) => a.distance - b.distance)[0];
    if (this.shouldEndSpin()) {
      // End the spinning and reset
      this.endSpin();
    }
  }

  shouldEndSpin(): boolean {
    if (this.state.pizzaslices[this.state.targetSlice].options.tickets === 0) return true;
    return this.state.timerSpin.isDone() && this.state.pizzaslices[this.state.targetSlice].options.name === this.state.currentLooser?.options?.name;
  }

  endSpin() {
    this.state.currentLooser?.setRoasting(this.state.getRandomRoast());
    this.state.gamestate = PizzaStates.ROAST_LOOSER;
    // this.state.timerSpin.reset();
    //this.state.timerSpin.setDurationFromTimestamp(Date.now() + 3000);

    console.log(`Spin ended, ${this.state.currentLooser?.options.name} up for roasting!`);
    this.events.emit("state", this.state as never);
  }

  roastLooser(delta: number) {
    if (this.state.timerSpin.isDone()) {
      this.state.currentLooser!.options.tickets -= 1;
      this.state.currentLooser?.setRoasting(undefined);
      // Check for winner
      if (this.state.pizzaslices.filter((slice) => slice.options.tickets > 0).length === 1) {
        this.state.gamestate = PizzaStates.CELEBRATE_WINNERS;
      } else {
        //Continue
        this.state.gamestate = PizzaStates.START;
      }

      console.log(`${this.state.currentLooser!.options.name} has ${this.state.currentLooser!.options.tickets} tickets left!`);
      return;
    }
    this.state.timerSpin.update(delta);
  }
}
