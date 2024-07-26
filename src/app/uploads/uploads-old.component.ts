import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'

import {
  Component,
  DestroyRef,
  Injector,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core'

import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputTagModule,
  TuiLineClampModule,
} from '@taiga-ui/kit'

import {
  TuiAlertService,
  TuiDialogModule,
  TuiDialogService,
  TuiDropdownModule,
  TuiHintModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core'

import {
  TuiChipModule,
  TuiIconModule,
  TuiSkeletonModule,
} from '@taiga-ui/experimental'

import {
  TuiTablePagination,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { CommonModule, DatePipe } from '@angular/common'
import { Apollo, QueryRef } from 'apollo-angular'
import { RouterModule } from '@angular/router'
import * as Sentry from '@sentry/angular'

import {
  UploadExtensionsGQL,
  UploadsGQL,
  AccountsInfoByUsernameGQL,
  UploadsQueryRef,
  AccountsInfoByUsernameQueryRef,
} from '@graphql'

import { AccountShortModel, UploadModel } from '@models'
import { inOutGridAnimation200 } from '@animations'
import { AuthService } from '@services'

import { Permission } from '@enums'

import { NotFoundComponent } from '@components/not-found/not-found.component'
import { UploadInfoComponent } from './upload-info/upload-info.component'
import { UploadFileComponent } from './upload-file/upload-file.component'

@Component({
  selector: 'spomen-uploads',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiInputTagModule,
    TuiDropdownModule,
    TuiDataListWrapperModule,
    TuiInputModule,
    TuiIconModule,
    TuiAvatarModule,
    RouterModule,
    TuiChipModule,
    TuiLineClampModule,
    TuiDialogModule,
    TuiSkeletonModule,
    TuiHintModule,
    TuiSvgModule,
    UploadInfoComponent,
    UploadFileComponent,
    NotFoundComponent,
    TuiTablePaginationModule,
  ],
  providers: [
    DatePipe,
    AccountsInfoByUsernameGQL,
    UploadsGQL,
    UploadExtensionsGQL,
  ],
  animations: [inOutGridAnimation200],
  templateUrl: './uploads-old.component.html',
  styleUrl: './uploads-old.component.scss',
})
@Sentry.TraceClass({ name: 'Uploads' })
export class UploadsOldComponent implements OnInit {
  private dialogs = inject(TuiDialogService)
  private alerts = inject(TuiAlertService)
  private destroyRef = inject(DestroyRef)
  private injector = inject(Injector)
  private apollo = inject(Apollo)

  private currentUser = inject(AuthService).$user().username

  private accountInfoByUsernameGql = inject(AccountsInfoByUsernameGQL)
  private uploadExtensionsGql = inject(UploadExtensionsGQL)
  private uploadsGql = inject(UploadsGQL)

  private accountsQuery: AccountsInfoByUsernameQueryRef | null = null
  private uploadsQuery: UploadsQueryRef | null = null

  filters: FormGroup = new FormGroup({
    username: new FormControl(),
    name: new FormControl(),
    ext: new FormControl(),
  })

  $accounts: WritableSignal<AccountShortModel[]> = signal([])
  $accountsList: Signal<string[]> = computed(() =>
    this.$accounts().map((val) => val.username)
  )
  $accountsFilter: WritableSignal<string> = signal('')
  $$accountFilter: Observable<string> = toObservable(this.$accountsFilter)

  $extensionsList: WritableSignal<string[]> = signal([])

  $uploadsOwners: WritableSignal<string[]> = signal([])
  $uploadsName: WritableSignal<string> = signal('')
  $uploadsExt: WritableSignal<string[]> = signal([])

  $uploadsSize: WritableSignal<number> = signal(20)
  $uploadsPage: WritableSignal<number> = signal(1)
  $uploadsLoading: WritableSignal<boolean> = signal(true)
  $uploads: WritableSignal<UploadModel[]> = signal([])

  uploadSkeletonLimit = new Array(10)

  // tagValidator: (tag: string) => boolean = () => true

  ngOnInit(): void {
    this.uploadsQuery = this.getUploads.watch(
      {
        size: this.$uploadsSize(),
        page: this.$uploadsPage(),
        owner:
          this.$uploadsOwners().length === 0
            ? undefined
            : this.$uploadsOwners(),
        name:
          this.$uploadsName().trim().length === 0
            ? undefined
            : this.$uploadsName(),
        ext: this.$uploadsExt().length === 0 ? undefined : this.$uploadsExt(),
      },
      { fetchPolicy: 'cache-and-network' }
    )

    this.uploadsQuery.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.$uploads.set(res.data.uploads)

          this.$uploadsLoading.set(false)
        },
        error: () => {
          this.alerts
            .open('Сервер временно недоступен', { status: 'error' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe()
          this.$uploadsLoading.set(false)
        },
      })

    this.filters.controls['username'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((items) => {
        this.$uploadsOwners.set(items)
        this.refetchUploads()
      })

    this.filters.controls['ext'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((items) => {
        this.$uploadsExt.set(items)
        this.refetchUploads()
      })

    this.filters.controls['name'].valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((items) => {
        this.$uploadsName.set(items)
        this.refetchUploads()
      })
  }

  handleSetExt(ext: string) {
    const currentValue = this.filters.controls['ext'].value

    if (!currentValue) this.filters.controls['ext'].setValue([ext])

    if (Array.isArray(currentValue) && !currentValue.includes(ext.trim())) {
      this.filters.controls['ext'].setValue([
        ...this.filters.controls['ext'].value,
        ext,
      ])
    }
  }

  showUploadInfo(uploadId: string) {
    this.showUploadInfoDialog(uploadId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  changePagination(params: TuiTablePagination) {
    if (params.page !== this.$uploadsPage()) {
      this.$uploadsPage.set(params.page)
    }

    if (params.size !== this.$uploadsSize()) {
      console.log('hi!')
      this.$uploadsSize.set(params.size)
    }
  }

  private showUploadInfoDialog = (uploadId: string) =>
    this.dialogs.open<string | null>(
      new PolymorpheusComponent(UploadInfoComponent, this.injector),
      {
        size: 's',
        data: {
          uploadId,
        },
      }
    )

  private refetchUploads() {
    if (!this.uploadsQuery) return

    this.$uploadsLoading.set(true)
    this.uploadsQuery.refetch({
      owner:
        this.$uploadsOwners().length === 0 ? undefined : this.$uploadsOwners(),
      name:
        this.$uploadsName().trim().length === 0
          ? undefined
          : this.$uploadsName().trim(),
      ext: this.$uploadsExt().length === 0 ? undefined : this.$uploadsExt(),
      page: this.$uploadsPage(),
      size: this.$uploadsSize(),
    })
  }
}
