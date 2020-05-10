import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const arenaFirstFighter = createArenaFighter(firstFighter);
    const arenaSecondFighter = createArenaFighter(secondFighter);

    const pressedKeys = new Map();

    document.addEventListener('keydown', (e) => {
      pressedKeys.set(e.code, true);

      processFightAction(arenaFirstFighter, arenaSecondFighter, pressedKeys);

      if (arenaFirstFighter.currentHealth <= 0 || arenaSecondFighter.currentHealth <= 0) {
        const winner = arenaFirstFighter.currentHealth <= 0 ? secondFighter : firstFighter;
        resolve(winner);
      }
    });

    document.addEventListener('keyup', (e) => {
      pressedKeys.delete(e.code);
    });
  });
}

function createArenaFighter(fighter) {
  return {
    ...fighter,
    currentHealth: fighter.health,
    criticalHitCoolDown: new Date(),
    setCoolDown() {
      this.criticalHitCoolDown = new Date(0);
    },
  };
}

function processFightAction(firstFighter, secondFighter, keyMap) {
  const leftHealthIndicator = document.getElementById('left-fighter-indicator');
  const rightHealthIndicator = document.getElementById('right-fighter-indicator');

  switch(true) {
    case keyMap.has(controls.PlayerOneAttack): {
      applyFighterAttack(firstFighter, secondFighter, rightHealthIndicator, keyMap);
    } break;
    case keyMap.has(controls.PlayerTwoAttack): {
      applyFighterAttack(secondFighter, firstFighter, leftHealthIndicator, keyMap);
    } break;
    case controls.PlayerOneCriticalHitCombination.every(code => keyMap.has(code)): {
      applyFighterCriticalAttack(firstFighter, secondFighter, rightHealthIndicator);
    } break;
    case controls.PlayerTwoCriticalHitCombination.every(code => keyMap.has(code)): {
      applyFighterCriticalAttack(secondFighter, firstFighter, leftHealthIndicator);
    } break;
  }
}

function applyFighterAttack(attacker, defender, healthIndicator, keyMap) {
  if (isAttackBlocked(keyMap)) return;

  defender.currentHealth -= getDamage(attacker, defender);
  updateHealthIndicator(defender, healthIndicator);
}

function applyFighterCriticalAttack(attacker, defender, healthIndicator) {
  if (isCriticalHitCoolDown(attacker)) return;

  defender.currentHealth -= attacker.attack * 2;
  updateHealthIndicator(defender, healthIndicator);

  attacker.setCoolDown();
}

function isAttackBlocked(keyMap) {
  return keyMap.has(controls.PlayerOneBlock) || keyMap.has(controls.PlayerTwoBlock);
}

function isCriticalHitCoolDown(attacker) {
  const coolDownSeconds = (new Date().getTime() - attacker.criticalHitCoolDown.getTime()) / 1000;
  return coolDownSeconds < 10;
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

function updateHealthIndicator(defender, indicator) {
  const { health, currentHealth } = defender;

  const indicatorWidth = Math.max(0, (currentHealth * 100) / health);
  indicator.style.width = `${indicatorWidth}%`;
}

