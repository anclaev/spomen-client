import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify'
import { RouterOutlet } from '@angular/router'
import { Component } from '@angular/core'

import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
} from '@taiga-ui/core'

import { HeaderComponent } from '@common/components/header/header.component'

@Component({
  selector: 'spomen-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    HeaderComponent,
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
