import { RouterModule } from '@angular/router'
import { Component, Input } from '@angular/core'
import * as Sentry from '@sentry/angular'

@Component({
  selector: 'spomen-not-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
@Sentry.TraceClass({ name: 'NotFound' })
export class NotFoundComponent {
  @Input() title: string = 'Такой страницы не существует'
  @Input() showRef: boolean = true
}
