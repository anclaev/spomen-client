import { Component } from '@angular/core'
import * as Sentry from '@sentry/angular'

@Component({
  selector: 'spomen-timelines',
  standalone: true,
  imports: [],
  templateUrl: './timelines.component.html',
  styleUrl: './timelines.component.scss',
})
@Sentry.TraceClass({ name: 'Timelines' })
export class TimelinesComponent {}
