import { Component } from '@angular/core'
import * as Sentry from '@sentry/angular'

@Component({
  selector: 'spomen-memories',
  standalone: true,
  imports: [],
  templateUrl: './memories.component.html',
  styleUrl: './memories.component.scss',
})
@Sentry.TraceClass({ name: 'Memories' })
export class MemoriesComponent {}
