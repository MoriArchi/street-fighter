import { showModal } from './modal';
import { createFighterImage } from '../fighterPreview';

export function showWinnerModal(fighter) {
    const imageElement = createFighterImage(fighter);
    const modalElement = {
        title: `${fighter.name.toUpperCase()} won!!!`,
        bodyElement: imageElement
    };

    showModal(modalElement);
}

