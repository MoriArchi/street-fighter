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
  const punches = createPunches(...selectedFighters);
  const fireballs = createFireballs(...selectedFighters);
  const critIndicators = createCritIndicators(...selectedFighters);
  
  arena.append(healthIndicators, fighters, shields, punches, fireballs, critIndicators);
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

function createPunches(firstFighter, secondFighter) {
  const container = createElement({ tagName: 'div', className: `arena___punches-container` });
  const firstFighterPunch = createPunch(firstFighter, 'left');
  const secondFighterPunch = createPunch(secondFighter, 'right');

  container.append(firstFighterPunch, secondFighterPunch);
  return container;
}

function createPunch(fighter, position) {
  const imgElement = createPunchImage();
  const positionClassName = position === 'right' ? 'arena___right-punch' : 'arena___left-punch';
  const fistElement = createElement({
    tagName: 'div',
    className: `${positionClassName}`,
    attributes: { id: `${position}-punch` }
  });

  fistElement.append(imgElement);
  return fistElement;
}

function createPunchImage() {
  const attributes = {
    src: '../../resources/punch.png',
    alt: 'punch'
  };
  return createElement({
    tagName: 'img',
    className: 'punch-img',
    attributes,
  });
}

function createFireballs(firstFighter, secondFighter) {
  const container = createElement({ tagName: 'div', className: `arena___fireballs-container` });
  const firstFighterBall = createFireball(firstFighter, 'left');
  const secondFighterBall = createFireball(secondFighter, 'right');

  container.append(firstFighterBall, secondFighterBall);
  return container;
}

function createFireball(fighter, position) {
  const imgElement = createFireballImage();
  const positionClassName = position === 'right' ? 'arena___right-fireball' : 'arena___left-fireball';
  const fireballElement = createElement({
    tagName: 'div',
    className: `${positionClassName}`,
    attributes: { id: `${position}-fireball` }
  });

  fireballElement.append(imgElement);
  return fireballElement;
}

function createFireballImage() {
  const attributes = {
    src: '../../resources/fireball.gif',
    alt: 'fireball'
  };
  return createElement({
    tagName: 'img',
    className: 'fireball-img',
    attributes,
  });
}

function createCritIndicators(firstFighter, secondFighter) {
  const container = createElement({ tagName: 'div', className: `arena___crit-indicators-container` });
  const firstFighterSuper = createCritIndicator(firstFighter, 'left');
  const secondFighterSuper = createCritIndicator(secondFighter, 'right');

  container.append(firstFighterSuper, secondFighterSuper);
  return container;
}

function createCritIndicator(fighter, position) {
  const imgElement = createFireballImage();
  const positionClassName = position === 'right' ? 'arena___right-crit-indicator' : 'arena___left-crit-indicator';
  const critIndicatorElement = createElement({
    tagName: 'div',
    className: `${positionClassName}`,
    attributes: { id: `${position}-crit-indicator` }
  });

  critIndicatorElement.append(imgElement);
  return critIndicatorElement;
}