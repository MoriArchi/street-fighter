import {controls, GAME_CONTROL_KEYS} from '../../constants/controls';
import {CRIT_POINTS_NEEDED_TO_CRIT_HIT} from '../../constants/fightConstants';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const firstArenaFighter = createArenaFighter(firstFighter);
    firstArenaFighter.restartCritPoints();
    const secondArenaFighter = createArenaFighter(secondFighter);

    secondArenaFighter.restartCritPoints();
    const pressedKeys = new Map();

    document.addEventListener('keydown', (e) => {
      if (e.repeat || !GAME_CONTROL_KEYS.some(key => key === e.code)) return;

      pressedKeys.set(e.code, true);

      processFightAction(firstArenaFighter, secondArenaFighter, pressedKeys, e.code);

      if (firstArenaFighter.currentHealth <= 0 || secondArenaFighter.currentHealth <= 0) {
        const winner = firstArenaFighter.currentHealth <= 0 ? secondFighter : firstFighter;
        resolve(winner);
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === controls.PlayerOneBlock) {
        toggleShield(false, 'left');
      }
      if (e.code === controls.PlayerTwoBlock) {
        toggleShield(false, 'right');
      }
      pressedKeys.delete(e.code);
    });
  });
}

function createArenaFighter(fighter) {
  return {
    ...fighter,
    currentHealth: fighter.health,
    currentCritPoints: 0,

    timerId: null,
    canCrit() {
      return this.currentCritPoints === CRIT_POINTS_NEEDED_TO_CRIT_HIT;
    },
    restartCritPoints() {
      this.currentCritPoints = 0;
      this.timerId = setInterval(() => {
        this.currentCritPoints++;

        if (this.canCrit()) {
          clearInterval(this.timerId);
        }
      }, 1000);
    },
  };
}

function processFightAction(firstFighter, secondFighter, keyMap, currentCode) {
  const leftHealthIndicator = document.getElementById('left-fighter-indicator');
  const rightHealthIndicator = document.getElementById('right-fighter-indicator');

  if (currentCode === controls.PlayerOneBlock) {
    toggleShield(true, 'left');
  }
  if (currentCode === controls.PlayerTwoBlock) {
    toggleShield(true, 'right');
  }
  if (currentCode === controls.PlayerOneAttack) {
    applyFighterAttack(firstFighter, secondFighter, rightHealthIndicator, keyMap);
    return;
  }
  if (currentCode === controls.PlayerTwoAttack) {
    applyFighterAttack(secondFighter, firstFighter, leftHealthIndicator, keyMap);
    return;
  }
  if (controls.PlayerOneCriticalHitCombination.every(code => keyMap.has(code))) {
    applyFighterCriticalAttack(firstFighter, secondFighter, rightHealthIndicator);
    return;
  }
  if (controls.PlayerTwoCriticalHitCombination.every(code => keyMap.has(code))) {
    applyFighterCriticalAttack(secondFighter, firstFighter, leftHealthIndicator);
  }
}

function applyFighterAttack(attacker, defender, healthIndicator, keyMap) {
  if (isAttackBlocked(keyMap)) {
    return;
  }

  defender.currentHealth -= getDamage(attacker, defender);
  updateHealthIndicator(defender, healthIndicator);
}

function applyFighterCriticalAttack(attacker, defender, healthIndicator) {
  if (attacker.canCrit()) {
    attacker.restartCritPoints();

    defender.currentHealth -= attacker.attack * 2;
    updateHealthIndicator(defender, healthIndicator);
  }
}

function isAttackBlocked(keyMap) {
  return keyMap.has(controls.PlayerOneBlock) || keyMap.has(controls.PlayerTwoBlock);
}

export function getDamage(attacker, defender) {
  return getHitPower(attacker) - getBlockPower(defender) > 0 ? getHitPower(attacker) - getBlockPower(defender) : 0;
}

export function getHitPower(fighter) {
  const criticalHitChance = getRandomFloat(1, 2);
  const power = fighter.attack * criticalHitChance;
  return power;
}

export function getBlockPower(fighter) {
  const dodgeChance = getRandomFloat(1, 2);
  const power = fighter.defense * dodgeChance;
  return power;
}

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function updateHealthIndicator(defender, indicator) {
  const {health, currentHealth} = defender;

  const indicatorWidth = Math.max(0, (currentHealth * 100) / health);
  indicator.style.width = `${indicatorWidth}%`;
}

function toggleShield(show, position) {
  const shield = document.getElementById(`${position}-shield`);
  if (show) {
    shield.style.visibility = 'visible';
  } else {
    shield.style.visibility = 'hidden';
  }
}
