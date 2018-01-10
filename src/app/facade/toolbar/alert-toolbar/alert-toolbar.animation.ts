import { trigger, state, animate, transition, style, keyframes } from '@angular/animations';

export const AlertAnimation =
trigger('alertAnimation', [
    transition('* => *',
        animate('800ms ease-out', keyframes([
            style({ opacity: 0, transform: 'scale(0.9, 0.9)', offset: 0.1 }),
            style({ opacity: 1, transform: 'scale(3, 3) rotate(30deg)', offset: 0.5 }),
            style({ opacity: 1, transform: 'rotate(-5deg)', offset: 0.8 })
        ]))
    )
]);