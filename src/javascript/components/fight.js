import { controls, GAME_CONTROL_KEYS } from '../../constants/controls';
import { CRIT_POINTS_NEEDED_TO_CRIT_HIT } from '../../constants/fightConstants';
import { POSITIONS, ATTACK_TYPES } from '../../constants/common';
import { getRandomFloatFromRange } from '../helpers/getRandomFloatFromRange';
import { createFighterConfigs } from './fightViewChanges';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const firstArenaFighter = createArenaFighter(
      firstFighter,
      createFighterConfigs(POSITIONS.LEFT),
    );
    const secondArenaFighter = createArenaFighter(
      secondFighter,
      createFighterConfigs(POSITIONS.RIGHT),
    );

    firstArenaFighter.restartCritPoints();
    secondArenaFighter.restartCritPoints();

    const pressedKeys = new Map();

    document.addEventListener('keydown', (e) => {
      if (e.repeat || !GAME_CONTROL_KEYS.some(key => key === e.code)) return;

      pressedKeys.set(e.code, true);

      processFightAction(firstArenaFighter, secondArenaFighter, pressedKeys, e.code);

      if (firstArenaFighter.currentHealth <= 0) {
        resolve(secondFighter);
      } else if (secondArenaFighter.currentHealth <= 0) {
        resolve(firstFighter);
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === controls.PlayerOneBlock) {
        firstArenaFighter.setIsBlocking(false);
      }
      if (e.code === controls.PlayerTwoBlock) {
        secondArenaFighter.setIsBlocking(false);
      }
      pressedKeys.delete(e.code);
    });
  });
}

function createArenaFighter(fighter, configs) {
  const { onPointsUpdated, onIsBlockingChanged, onDamageReceived, onAttacking } = configs;

  return {
    ...fighter,
    currentHealth: fighter.health,
    currentCritPoints: 0,
    isBlocking: false,
    timerId: null,
    receiveDamage(value) {
      this.currentHealth -= value;
      onDamageReceived(this.currentHealth, this.health);
    },
    setIsBlocking(value) {
      this.isBlocking = value;
      onIsBlockingChanged(value);
    },
    doAttack(defender, damage) {
      defender.receiveDamage(damage);
      onAttacking(ATTACK_TYPES.PUNCH);
    },
    doCritAttack(defender) {
      if (!this.isCanDoCrit()) return;

      this.restartCritPoints();
      defender.receiveDamage(this.attack * 2);
      onAttacking(ATTACK_TYPES.FIREBALL);
    },
    isCanDoCrit() {
      return this.currentCritPoints === CRIT_POINTS_NEEDED_TO_CRIT_HIT;
    },
    restartCritPoints() {
      this.currentCritPoints = 0;
      onPointsUpdated(this.currentCritPoints, false);

      this.timerId = setInterval(() => {
        this.currentCritPoints++;

        const canDoCrit = this.isCanDoCrit();

        onPointsUpdated(this.currentCritPoints, canDoCrit);

        if (canDoCrit) {
          clearInterval(this.timerId);
        }
      }, 1000);
    },
  };
}

function processFightAction(firstFighter, secondFighter, keyMap, currentCode) {
  if (currentCode === controls.PlayerOneBlock) {
    firstFighter.setIsBlocking(true);
  }
  if (currentCode === controls.PlayerTwoBlock) {
    secondFighter.setIsBlocking(true);
  }
  if (currentCode === controls.PlayerOneAttack) {
    applyFighterAttack(firstFighter, secondFighter, keyMap);
    return;
  }
  if (currentCode === controls.PlayerTwoAttack) {
    applyFighterAttack(secondFighter, firstFighter, keyMap);
    return;
  }
  if (controls.PlayerOneCriticalHitCombination.every(code => keyMap.has(code))) {
    firstFighter.doCritAttack(secondFighter);
    return;
  }
  if (controls.PlayerTwoCriticalHitCombination.every(code => keyMap.has(code))) {
    secondFighter.doCritAttack(firstFighter);
  }
}

function applyFighterAttack(attacker, defender) {
  if (attacker.isBlocking) {
    return;
  }

  if (defender.isBlocking) {
    attacker.doAttack(defender, 0);
    return;
  }

  attacker.doAttack(defender, getDamage(attacker, defender));
}

function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage > 0 ? damage : 0;
}

function getHitPower(fighter) {
  const criticalHitChance = getRandomFloatFromRange(1, 2);
  return fighter.attack * criticalHitChance;
}

function getBlockPower(fighter) {
  const dodgeChance = getRandomFloatFromRange(1, 2);
  return fighter.defense * dodgeChance;
}
