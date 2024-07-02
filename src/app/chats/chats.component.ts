import { Component } from '@angular/core'
import * as Sentry from '@sentry/angular'

@Component({
  selector: 'spomen-chats',
  standalone: true,
  imports: [],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
@Sentry.TraceClass({ name: 'Chats' })
export class ChatsComponent {}
