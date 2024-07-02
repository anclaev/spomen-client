import { Component } from '@angular/core'
import * as Sentry from '@sentry/angular'

@Component({
  selector: 'spomen-oops',
  standalone: true,
  imports: [],
  templateUrl: './oops.component.html',
  styleUrl: './oops.component.scss',
})
@Sentry.TraceClass({ name: 'Oops' })
export class OopsComponent {}
