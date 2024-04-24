import React from 'react';
import './player.scss';
const assets = [
  "trans_mad",
  "trans_pout",
  "trans_happy",
  "trans_jikes",
  "trans_tihi",
  "trans_laugh",
  "trans_sorry",
  "trans_super",
  "trans_suprise",
  "trans_what"
]

const getNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const chooseAsset = (player) => {
  if (player.tickets >= 3) {
    return assets[getNumberBetween(2, assets.length - 1)];
  } else {
    return assets[getNumberBetween(4, assets.length - 1)];
  }
}

export const Player = ({ player, isRoasted, isWinner }) => {
  return (
    <div className="player">
      <img className={`${isRoasted || 'nothing'} ${isWinner ? 'winner' : ''}`} src={`/players/${player.id}/${isRoasted ? assets[1] : chooseAsset(player)}.png`} />
      <div>{player.name}</div>
      <div className="ticket">
        {Array.from({ length: player.tickets }).map((ticket, index) => (
          <div key={index} >
            <i className="fa-solid fa-wine-bottle"></i>
            <span>{ticket}</span>
          </div>
        ))}
        {player.tickets === 0 && <div><i className="fa-solid fa-hand-middle-finger red"></i></div>}
      </div>
    </div>
  );
}