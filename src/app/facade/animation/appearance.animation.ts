import { trigger, state, animate, transition, style, keyframes } from '@angular/animations';

export const FlyFromTopAnimation =
    trigger('flyFromTopAnimation', [
        transition('* => *',
            animate('500ms ease-in', keyframes([
                style({ opacity: 0, transform: 'translateY(30%)', offset: 0 }),
                style({ opacity: 1, transform: 'translateY(1%)', offset: 0.8 })
            ]))
        )
    ]);

export const HorisontalExpansionAnimation =
    trigger('horisontalExpansionAnimation', [
        state('expanded', style({transform: 'scale(1,1)'})),
        state('collapsed', style({ display: 'none', transform: 'scale(0.1,1)'})),
        transition('collapsed => expanded', animate('100ms ease-in', )),
        transition('expanded => collapsed', animate('100ms ease-in', ))
    ]);
