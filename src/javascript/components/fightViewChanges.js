export function updateHealthIndicator(currentHealth, health, position) {
  const healthIndicator = document.getElementById(`${position}-fighter-indicator`);

  const indicatorWidth = Math.max(0, (currentHealth * 100) / health);
  healthIndicator.style.width = `${indicatorWidth}%`;
}

export function toggleShield(show, position) {
  const shield = document.getElementById(`${position}-shield`);
  if (show) {
    shield.style.visibility = 'visible';
  } else {
    shield.style.visibility = 'hidden';
  }
}

export function showAttack(position, attack) {
  const attackElement = document.getElementById(`${position}-${attack}`);
  attackElement.classList.add(`arena___${position}-${attack}-show`);
  setTimeout(() => {
    attackElement.classList.remove(`arena___${position}-${attack}-show`);
  }, 300);
}

export function toggleCritSignal(show, position) {
  const indicator = document.getElementById(`${position}-crit-signal`);
  if (show) {
    indicator.style.visibility = 'visible';
  } else {
    indicator.style.visibility = 'hidden';
  }
}

export function updateRageIndicator(position, width) {
  const rageIndicator = document.getElementById(`${position}-rage-indicator`);
  rageIndicator.style.width = `${width}%`;
}

export const createCritPointsUpdatedHandler = (position) => (currentPoints, canCrit) => {
  if (currentPoints === 0) {
    toggleCritSignal(false, position);
  }

  if (canCrit) {
    toggleCritSignal(true, position);
  }

  updateRageIndicator(position, currentPoints * 10);
};

export const createIsBlockingChangedHandler = position => (isBlocking) => {
  toggleShield(isBlocking, position)
};

export const createIsDamageReceivedHandler = position => (currentHealth, health) => {
  updateHealthIndicator(currentHealth, health, position);
};

export const createIsAttackingHandler = position => (attack) => {
  showAttack(position, attack)
};

export const createFighterConfigs = position => ({
  onPointsUpdated: createCritPointsUpdatedHandler(position),
  onIsBlockingChanged: createIsBlockingChangedHandler(position),
  onDamageReceived: createIsDamageReceivedHandler(position),
  onAttacking: createIsAttackingHandler(position)
});
