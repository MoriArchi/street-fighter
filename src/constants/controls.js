export const controls = {
  PlayerOneAttack: 'KeyA',
  PlayerOneBlock: 'KeyD',
  PlayerTwoAttack: 'KeyJ',
  PlayerTwoBlock: 'KeyL',
  PlayerOneCriticalHitCombination: ['KeyQ', 'KeyW', 'KeyE'],
  PlayerTwoCriticalHitCombination: ['KeyU', 'KeyI', 'KeyO']
};

export const GAME_CONTROL_KEYS = Object.values(controls).flat(2);
