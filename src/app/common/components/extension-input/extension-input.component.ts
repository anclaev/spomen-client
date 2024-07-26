import {
  ControlValueAccessor,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms'
import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core'
import { TuiAlertService, TuiTextfieldControllerModule } from '@taiga-ui/core'
import { TuiDataListWrapperModule, TuiInputTagModule } from '@taiga-ui/kit'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'

import { UploadExtensionsGQL } from '@graphql'
import { UploadService } from '@services'

@Component({
  selector: 'spomen-extension-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiInputTagModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ExtensionInputComponent,
    },
    UploadService,
    UploadExtensionsGQL,
  ],
  templateUrl: './extension-input.component.html',
  styleUrl: './extension-input.component.scss',
})
@Sentry.TraceClass({ name: 'ExtensionInput' })
export class ExtensionInputComponent implements OnInit, ControlValueAccessor {
  private uploadExtensionsGQL = inject(UploadExtensionsGQL)
  private alerts = inject(TuiAlertService)
  private destroyRef = inject(DestroyRef)

  @Input() formGroup!: FormGroup
  @Input() formControlName: string = ''
  @Input() size: 'm' | 's' | 'l' = 's'
  @Input() placeholder: string = 'Тип'

  @Input() onChange = () => {}

  onTouched = () => {}

  disabled = false

  @Output() $extensions: WritableSignal<string[]> = signal([])

  ngOnInit() {
    this.uploadExtensionsGQL
      .watch({
        size: 20,
        page: 1,
      })
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          this.$extensions.set(data.uploadExtensions)
        },
        error: () => {
          this.alerts
            .open('Не удалось получить список расширений', {
              status: 'error',
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
        },
      })
  }

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
