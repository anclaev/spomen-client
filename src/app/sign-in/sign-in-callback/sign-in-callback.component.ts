import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { TuiAlertService, TuiLoaderModule } from '@taiga-ui/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common'

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'

import { getQueryPayload } from '@utils/getQueryPayload'
import Validation from '@utils/validation'

import { SignInCallbackResponse } from '@tps/dto/sign-in-callback'

@Component({
  selector: 'spomen-sign-in-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiLoaderModule],
  templateUrl: './sign-in-callback.component.html',
  styleUrl: './sign-in-callback.component.scss',
})
export class SignInCallbackComponent implements OnInit, OnDestroy {
  private token: BehaviorSubject<string> = new BehaviorSubject('')
  private route = inject(ActivatedRoute)
  private alerts = inject(TuiAlertService)
  private subs$: Subscription[] = []

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  isLoading$$: Observable<boolean> = this.isLoading.asObservable()

  form: FormGroup<{
    pass: FormControl<string | null>
    confirmPass: FormControl<any>
  }> = new FormGroup({
    pass: new FormControl(''),
    confirmPass: new FormControl(),
  })

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const payload = getQueryPayload<SignInCallbackResponse>(
      this.route.snapshot.queryParams
    )!

    this.token.next(payload.token)

    this.form = this.fb.group(
      {
        pass: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(30),
          ],
        ],
        confirmPass: ['', [Validators.required]],
      },
      {
        validators: [Validation.match('pass', 'confirmPass')],
      }
    )
  }

  onSubmit() {
    if (!this.form.valid) {
      let errors: string[] = []

      Object.keys(this.form.controls).forEach((control) => {
        if (
          this.form.controls[control as keyof typeof this.form.controls].errors
        ) {
          Object.keys(
            this.form.controls[control as keyof typeof this.form.controls]
              .errors!
          ).forEach((error) => {
            switch (error) {
              case 'required': {
                errors.push('Пароль обязателен')
                break
              }

              case 'minlength': {
                errors.push('Пароль должен быть не менее 8 символов')
                break
              }

              case 'match': {
                errors.push('Пароли должны быть одинаковы')
                break
              }

              default: {
                errors.push('Проверьте правильность полей')
              }
            }
          })
        }
      })

      new Set(errors).forEach((error) =>
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
