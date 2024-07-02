import { Component } from '@angular/core'
import * as Sentry from '@sentry/angular'

@Component({
  selector: 'spomen-uploads',
  standalone: true,
  imports: [],
  templateUrl: './uploads.component.html',
  styleUrl: './uploads.component.scss',
})
@Sentry.TraceClass({ name: 'Uploads' })
export class UploadsComponent {}
