import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus'
import { Component, Inject } from '@angular/core'
import { TuiAlertOptions } from '@taiga-ui/core'
import { TuiDialog } from '@taiga-ui/cdk'

interface ConfirmAlertOptions {
  message: string
  confirmMessage: string
}

@Component({
  selector: 'spomen-confirm-alert',
  standalone: true,
  templateUrl: './confirm-alert.component.html',
  styleUrl: './confirm-alert.component.scss',
})
export class ConfirmAlertComponent {
  confirmMessage: string

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialog<
      TuiAlertOptions<ConfirmAlertOptions>,
      boolean
    >
  ) {
    this.confirmMessage = this.context.data.confirmMessage
  }

  complete(): void {
    this.context.completeWith(true)
  }
}
