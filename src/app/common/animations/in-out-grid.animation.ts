import { animate, style, transition, trigger } from '@angular/animations'

export const inOutGridAnimation500 = trigger('inOutGrid500', [
  transition(':enter', [
    style({
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    animate(
      '500ms ease-in',
      style({
        opacity: 1,
        position: 'absolute',
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
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    animate(
      '500ms ease-in',
      style({
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      })
    ),
  ]),
])

export const inOutGridAnimation200 = trigger('inOutGrid200', [
  transition(':enter', [
    style({
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    animate(
      '200ms ease-in',
      style({
        opacity: 1,
        position: 'absolute',
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
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    animate(
      '200ms ease-in',
      style({
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      })
    ),
  ]),
])
