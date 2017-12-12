import { trigger, state, animate, transition, style } from '@angular/animations';

//TODO: Integrate with Material Design color mat-color (remove hard-coded color)
export const NavigationItemState =
    trigger('navigationItemState', [
        state('active', style({ background: "rgba(255,255,255,0.1)" })),
        state('inactive', style({})),
        transition('inactive => active',animate('500ms ease-in'))
    ]);

