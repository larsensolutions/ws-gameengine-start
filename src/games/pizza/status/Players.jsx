import React from 'react';
import { Player } from './Player';

import './players.scss';

export const Players = ({ state }) => {
  const winner = state.gamestate === "finished" ? state.pizzaslices.find((pizzaslice) => pizzaslice.options.tickets > 0) : null;
  return (
    <div className="players">
      {state.pizzaslices.map((pizzaslice) => (
        <Player key={pizzaslice.options.id} player={pizzaslice.options} isRoasted={pizzaslice.roastMessage ? true : false} isWinner={winner?.options?.id === pizzaslice.options.id} />
      ))}
    </div>
  );
}
