import { TuiAlertService, TuiLoaderModule } from '@taiga-ui/core'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import * as VKID from '@vkid/sdk'

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core'

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'

import { AuthService } from '@common/services/auth.service'
import { AuthStore } from '@store/auth'

@Component({
  selector: 'spomen-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiLoaderModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('VkIdSdkOneTap') VkIdSdkOneTap!: ElementRef<HTMLDivElement>

  private alerts = inject(TuiAlertService)
  private store = inject(AuthStore)
  private router = inject(Router)

  private vkIdOneTap = new VKID.OneTap()
  private subs$: Subscription[] = []

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  isLoading$$: Observable<boolean> = this.isLoading.asObservable()

  form: FormGroup<{
    login: FormControl<string | null>
    pass: FormControl<string | null>
  }> = new FormGroup({
    login: new FormControl(''),
    pass: new FormControl(''),
  })

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

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
          Validators.minLength(4),
          Validators.maxLength(30),
        ],
      ],
    })
  }

  ngAfterViewInit(): void {
    if (this.VkIdSdkOneTap) {
      this.vkIdOneTap.render({
        container: this.VkIdSdkOneTap.nativeElement,
        scheme: VKID.Scheme.DARK,
        lang: VKID.Languages.RUS,
        styles: {
          borderRadius: 50,
        },
      })
    }
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

    // this.subs$.push(this.alerts.open('Запрос на сервер...').subscribe())
    this.isLoading.next(true)

    this.subs$.push(
      this.auth
        .signIn({
          login: this.form.controls.login.value!.trim(),
          password: this.form.controls.pass.value!.trim(),
        })
        .subscribe({
          next: (data) => {
            this.store.setSession(data)
            this.router.navigate(['/'])
          },
          error: (err) => {
            this.isLoading.next(false)

            if (err.status === 400) {
              this.subs$.push(this.alerts.open(`Вход не выполнен`).subscribe())
              return
            }

            this.subs$.push(
              this.alerts.open(`Приложение временно недоступно`).subscribe()
            )
          },
          complete: () => this.isLoading.next(false),
        })
    )
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub) => sub.unsubscribe())
  }
}
