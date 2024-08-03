import { Pipe, PipeTransform } from '@angular/core'

import { Sex } from '@interfaces'

@Pipe({
  name: 'sex',
  standalone: true,
})
export class SexPipe implements PipeTransform {
  transform(value: Sex | null): string {
    switch (value) {
      case 1: {
        return 'Женский'
      }
      case 2: {
        return 'Мужской'
      }
      default: {
        return 'Не указан'
      }
    }
  }
}
