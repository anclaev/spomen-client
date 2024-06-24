import { animate, style, transition, trigger } from '@angular/animations'

export const inOutAnimation = trigger('inOut', [
  transition(':enter', [
    style({
      opacity: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    animate(
      '500ms ease-in',
      style({
        opacity: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      })
    ),
  ]),
  transition(':leave', [
    style({
      opacity: 1,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    animate(
      '500ms ease-in',
      style({
        opacity: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      })
    ),
  ]),
])
