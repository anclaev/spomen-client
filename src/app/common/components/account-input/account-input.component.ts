import {
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core'

import {
  ControlValueAccessor,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms'

import { TuiAlertService, TuiTextfieldControllerModule } from '@taiga-ui/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { TuiDataListWrapperModule, TuiInputTagModule } from '@taiga-ui/kit'
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs'
import { CommonModule } from '@angular/common'
import * as Sentry from '@sentry/angular'

import {
  AccountsInfoByUsernameGQL,
  AccountsInfoByUsernameQueryRef,
} from '@graphql'
import { AccountShortModel } from '@models'

@Component({
  selector: 'spomen-account-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiDataListWrapperModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiInputTagModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AccountInputComponent,
    },
    AccountsInfoByUsernameGQL,
  ],
  templateUrl: './account-input.component.html',
  styleUrl: './account-input.component.scss',
})
@Sentry.TraceClass({ name: 'AccountInput' })
export class AccountInputComponent implements OnInit, ControlValueAccessor {
  private destroyRef = inject(DestroyRef)
  private alerts = inject(TuiAlertService)

  private accountInfoGQL = inject(AccountsInfoByUsernameGQL)

  private accountInfoQuery: AccountsInfoByUsernameQueryRef | null = null

  @Input() formGroup!: FormGroup
  @Input() formControlName: string = ''
  @Input() placeholder: string = 'Аккаунт'

  @Input() onChange = () => {}

  onTouched = () => {}

  disabled = false

  $accounts: WritableSignal<AccountShortModel[]> = signal([])

  $accountsList: Signal<string[]> = computed(() =>
    this.$accounts().map((val) => val.username)
  )

  $accountsFilter: WritableSignal<string> = signal('')
  $$accountFilter: Observable<string> = toObservable(this.$accountsFilter)

  ngOnInit() {
    this.accountInfoQuery = this.accountInfoGQL.watch(
      {
        username: this.$accountsFilter(),
      },
      { fetchPolicy: 'cache-and-network' }
    )

    this.$$accountFilter
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.accountInfoQuery!.refetch({
          username: this.$accountsFilter(),
        })
      })

    this.accountInfoQuery.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.$accounts.set(res.data.accounts)
        },
        error: () => {
          this.alerts
            .open('Не удалось получить список аккаунтов', { status: 'error' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
        },
      })
  }

  handleChange(val: string) {
    if (val.trim().length > 0 && val.trim() !== this.$accountsFilter()) {
      this.$accountsFilter.set(val.trim())
    }
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
