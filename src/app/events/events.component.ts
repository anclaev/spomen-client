import { Component } from '@angular/core'
import * as Sentry from '@sentry/angular'
@Component({
  selector: 'spomen-events',
  standalone: true,
  imports: [],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
@Sentry.TraceClass({ name: 'Events' })
export class EventsComponent {}
