import { createElement } from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import { fight } from './fight';
import { showWinnerModal } from './modal/winner';

export async function renderArena(selectedFighters) {
  const root = document.getElementById('root');
  const arena = createArena(selectedFighters);

  root.innerHTML = '';
  root.append(arena);

  try {
    const [firstFighter, secondFighter] = selectedFighters;
    const winner = await fight(firstFighter, secondFighter);
    showWinnerModal(winner);
  } catch (error) {
    throw error;
  }
}

function createArena(selectedFighters) {
  const arena = createElement({ tagName: 'div', className: 'arena___root' });
  const healthIndicators = createHealthIndicators(...selectedFighters);
  const fighters = createFighters(...selectedFighters);
  const shields = createShields(...selectedFighters);
  
  arena.append(healthIndicators, fighters, shields);
  return arena;
}

function createHealthIndicators(firstFighter, secondFighter) {
  const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
  const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
  const leftFighterIndicator = createHealthIndicator(firstFighter, 'left');
  const rightFighterIndicator = createHealthIndicator(secondFighter, 'right');

  healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
  return healthIndicators;
}

function createHealthIndicator(fighter, position) {
  const { name } = fighter;
  const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
  const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
  const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
  const bar = createElement({ tagName: 'div', className: 'arena___health-bar', attributes: { id: `${position}-fighter-indicator` }});

  fighterName.innerText = name;
  indicator.append(bar);
  container.append(fighterName, indicator);

  return container;
}

function createFighters(firstFighter, secondFighter) {
  const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
  const firstFighterElement = createFighter(firstFighter, 'left');
  const secondFighterElement = createFighter(secondFighter, 'right');

  battleField.append(firstFighterElement, secondFighterElement);
  return battleField;
}

function createFighter(fighter, position) {
  const imgElement = createFighterImage(fighter);
  const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
  const fighterElement = createElement({
    tagName: 'div',
    className: `arena___fighter ${positionClassName}`,
  });

  fighterElement.append(imgElement);
  return fighterElement;
}

function createShields(firstFighter, secondFighter) {
  const container = createElement({ tagName: 'div', className: `arena___shields-container` });
  const firstFighterShield = createShield(firstFighter, 'left');
  const secondFighterShield = createShield(secondFighter, 'right');

  container.append(firstFighterShield, secondFighterShield);
  return container;
}

function createShield(fighter, position) {
  const imgElement = createShieldImage();
  const positionClassName = position === 'right' ? 'arena___right-shield' : 'arena___left-shield';
  const shieldElement = createElement({
    tagName: 'div',
    className: `${positionClassName}`,
    attributes: { id: `${position}-shield` }
  });

  shieldElement.append(imgElement);
  return shieldElement;
}

function createShieldImage() {
  const attributes = {
    src: '../../resources/shield.png',
    alt: 'shield'
  };
  return createElement({
    tagName: 'img',
    className: 'shield-img',
    attributes,
  });
}
