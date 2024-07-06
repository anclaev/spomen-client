import { Pipe, PipeTransform } from '@angular/core'

import { Sex } from '@interfaces'

@Pipe({
  name: 'sex',
  standalone: true,
})
export class SexPipe implements PipeTransform {
  transform(value: Sex | null): string {
    switch (value) {
      case '1': {
        return 'Мужской'
      }
      case '2': {
        return 'Женский'
      }
      default: {
        return 'Не указан'
      }
    }
  }
}
