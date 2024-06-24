import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'

import {
  TuiAlertService,
  TuiDialogModule,
  TuiLoaderModule,
} from '@taiga-ui/core'

import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { TuiInputDateModule } from '@taiga-ui/kit'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { TuiDay } from '@taiga-ui/cdk'

import { AuthService } from '@services/auth.service'

@Component({
  selector: 'spomen-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiLoaderModule,
    TuiInputDateModule,
    TuiDialogModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit, OnDestroy {
  private alerts = inject(TuiAlertService)
  private auth = inject(AuthService)
  private router = inject(Router)

  private subs$: Subscription[] = []

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  isLoading$$: Observable<boolean> = this.isLoading.asObservable()

  showConfirmForm = false

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

  confirmForm: FormGroup<{
    confirmPass: FormControl<string | null>
  }> = new FormGroup({
    confirmPass: new FormControl(''),
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
      name: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      surname: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      email: [
        '',
        [Validators.email, Validators.minLength(4), Validators.maxLength(30)],
      ],
      birthday: [new TuiDay(2000, 4, 27)],
    })

    this.confirmForm = this.fb.group({
      confirmPass: ['', [Validators.required]],
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

      if (this.form.controls.name.errors || this.form.controls.surname.errors) {
        errors.push('Введите корректные имя и фамилию')
      }

      if (this.form.controls.email.errors) {
        errors.push('Введите корректную почту')
      }

      errors.forEach((error) =>
        this.subs$.push(this.alerts.open(error).subscribe())
      )

      return
    }

    this.showConfirmForm = true
  }

  confirmPass() {
    if (
      this.form.controls.pass.value!.trim() !==
      this.confirmForm.controls.confirmPass.value!.trim()
    ) {
      this.subs$.push(this.alerts.open('Некорректный пароль').subscribe())
      this.confirmForm.controls.confirmPass.reset()
      this.form.controls.pass.reset()
      return
    }

    this.isLoading.next(true)

    this.subs$.push(
      this.auth
        .signUp({
          username: this.form.controls.login.value!.trim(),
          password: this.form.controls.pass.value!.trim(),
          birthday: this.form.controls.birthday.touched
            ? this.form.controls.birthday.value!.toUtcNativeDate().toISOString()
            : undefined,
          email:
            this.form.controls.email.touched &&
            this.form.controls.email.valid &&
            this.form.controls.email.value!.trim().length > 0
              ? this.form.controls.email.value!.trim()
              : undefined,
          first_name:
            this.form.controls.name.touched &&
            this.form.controls.name.valid &&
            this.form.controls.name.value!.trim().length > 2
              ? this.form.controls.name.value!.trim()
              : undefined,
          last_name:
            this.form.controls.surname.touched &&
            this.form.controls.surname.valid &&
            this.form.controls.surname.value!.trim().length > 2
              ? this.form.controls.surname.value!.trim()
              : undefined,
        })
        .subscribe({
          next: (data) => {
            this.isLoading.next(false)
            this.auth.set(data)
            this.router.navigate(['/'])
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 409) {
              if (this.form.controls.email.value!.trim().length === 0) {
                this.subs$.push(
                  this.alerts
                    .open('Данный логин уже зарегистрирован')
                    .subscribe()
                )

                this.isLoading.next(false)
                return
              } else if (
                this.form.controls.email.touched &&
                this.form.controls.email.valid
              ) {
                this.subs$.push(
                  this.alerts
                    .open('Данная почта уже зарегистрирована')
                    .subscribe()
                )

                this.isLoading.next(false)
                return
              }
            }

            this.subs$.push(
              this.alerts.open('Сервер временно недоступен').subscribe()
            )

            this.isLoading.next(false)
            return
          },
          complete: () => {
            this.confirmForm.controls.confirmPass.setValue('')
          },
        })
    )
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub) => sub.unsubscribe())
  }
}

// TODO: Сброс паролей в обеих формах при неудачной регистрации
