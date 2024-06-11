import { animate, style, transition, trigger } from '@angular/animations'

export const enterLeave = trigger('enterLeave', [
  transition(':enter', [
    style({
      transform: 'translateX(-50%)',
      opacity: 0,
      position: 'absolute',
      top: '0',
    }),
    animate(
      '500ms ease-in',
      style({
        transform: 'translateX(0)',
        opacity: 1,
        position: 'absolute',
        top: '0',
      })
    ),
  ]),
  transition(':leave', [
    style({
      transform: 'translateX(0)',
      opacity: 1,
      position: 'absolute',
      top: '0',
    }),
    animate(
      '500ms ease-in',
      style({
        transform: 'translateX(50%)',
        opacity: 0,
        position: 'absolute',
        top: '0',
      })
    ),
  ]),
])
