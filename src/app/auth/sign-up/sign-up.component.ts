import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'

import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { TuiAlertService, TuiLoaderModule } from '@taiga-ui/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { TuiInputDateModule } from '@taiga-ui/kit'
import { CommonModule } from '@angular/common'
import { TuiDay } from '@taiga-ui/cdk'

// TODO: Продумать данные пользователя при регистрации
@Component({
  selector: 'spomen-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiLoaderModule,
    TuiInputDateModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit, OnDestroy {
  private alerts = inject(TuiAlertService)
  private subs$: Subscription[] = []

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  isLoading$$: Observable<boolean> = this.isLoading.asObservable()

  form: FormGroup<{
    login: FormControl<string | null>
    pass: FormControl<string | null>
    name: FormControl<string | null>
    surname: FormControl<string | null>
    email: FormControl<string | null>
    birthday: FormControl<TuiDay | null>
  }> = new FormGroup({
    login: new FormControl(''),
    pass: new FormControl(''),
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    birthday: new FormControl(new TuiDay(2000, 4, 27)),
  })

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      login: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ],
      ],
      pass: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
        ],
      ],
      name: ['', [Validators.minLength(3), Validators.maxLength(30)]],
      surname: ['', [Validators.minLength(4), Validators.maxLength(30)]],
      email: [
        '',
        [Validators.email, Validators.minLength(4), Validators.maxLength(30)],
      ],
      birthday: [new TuiDay(2000, 4, 27)],
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      let errors: string[] = []

      if (this.form.controls.login.errors) {
        errors.push('Введите логин')
      }

      if (this.form.controls.pass.errors) {
        errors.push('Введите пароль')
      }

      errors.forEach((error) =>
        this.subs$.push(this.alerts.open(error).subscribe())
      )

      return
    }

    this.subs$.push(this.alerts.open('Запрос на сервер...').subscribe())
    this.isLoading.next(true)
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub) => sub.unsubscribe())
  }
}
