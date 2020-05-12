export function updateHealthIndicator(defender, indicator) {
  const {health, currentHealth} = defender;

  const indicatorWidth = Math.max(0, (currentHealth * 100) / health);
  indicator.style.width = `${indicatorWidth}%`;
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

export function toggleCritIndicator(show, position) {
  const indicator = document.getElementById(`${position}-crit-indicator`);
  if(show) {
    indicator.style.visibility = 'visible';
  } else {
    indicator.style.visibility = 'hidden';
  }
}
