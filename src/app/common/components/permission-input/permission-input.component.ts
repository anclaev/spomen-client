import {
  ControlValueAccessor,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms'
import { TuiDataListWrapperModule, TuiInputTagModule } from '@taiga-ui/kit'
import { TuiTextfieldControllerModule } from '@taiga-ui/core'
import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'

@Component({
  selector: 'spomen-permission-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputTagModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: PermissionInputComponent,
    },
  ],
  templateUrl: './permission-input.component.html',
  styleUrl: './permission-input.component.scss',
})
@Sentry.TraceClass({ name: 'PermissionInput' })
export class PermissionInputComponent implements ControlValueAccessor {
  @Input() formGroup!: FormGroup
  @Input() formControlName: string = ''
  @Input() size: 'm' | 's' | 'l' = 's'
  @Input() placeholder: string = 'Права доступа'
  @Input() permissions: string[] = [
    'Публичный',
    'Чат',
    'Воспоминание',
    'Личный',
  ]

  @Input() onChange = () => {}

  onTouched = () => {}

  disabled = false

  writeValue() {}

  registerOnChange(onChange: any) {
    this.onChange = onChange
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled
  }
}
