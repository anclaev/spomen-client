import { animate, style, transition, trigger } from '@angular/animations'

export const inOut = trigger('inOut', [
  transition(':enter', [
    style({
      opacity: 0,
      position: 'absolute',
      top: '0',
    }),
    animate(
      '500ms ease-in',
      style({
        opacity: 1,
        position: 'absolute',
        top: '0',
      })
    ),
  ]),
  transition(':leave', [
    style({
      opacity: 1,
      position: 'absolute',
      top: '0',
    }),
    animate(
      '500ms ease-in',
      style({
        opacity: 0,
        position: 'absolute',
        top: '0',
      })
    ),
  ]),
])
