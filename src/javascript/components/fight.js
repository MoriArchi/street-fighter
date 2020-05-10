import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
  });
}

export function getDamage(attacker, defender) {
  return getHitPower(attacker) - getBlockPower(defender) > 0 ? getHitPower(attacker) - getBlockPower(defender) : 0;
}

export function getHitPower(fighter) {
  const criticalHitChance = getRandomIntInclusive(1, 2);
  const power = fighter.attack * criticalHitChance;
  return power;
}

export function getBlockPower(fighter) {
  const dodgeChance = getRandomIntInclusive(1, 2);
  const power = fighter.defense * dodgeChance;
  return power;
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.random() * (max - min) + min;
}

