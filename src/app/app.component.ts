import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify'
import { RouterOutlet } from '@angular/router'
import { Component } from '@angular/core'

import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
} from '@taiga-ui/core'

@Component({
  selector: 'spomen-root',
  standalone: true,
  imports: [RouterOutlet, TuiRootModule, TuiDialogModule, TuiAlertModule],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Воспоминания'
}
