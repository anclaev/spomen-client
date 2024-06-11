import { TuiTabsModule } from '@taiga-ui/kit'
import { Component } from '@angular/core'

import { enterLeave } from '@common/animations/enter-leave'

import { SignInComponent } from './sign-in/sign-in.component'
import { SignUpComponent } from './sign-up/sign-up.component'

@Component({
  selector: 'spomen-auth',
  standalone: true,
  imports: [TuiTabsModule, SignInComponent, SignUpComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  animations: [enterLeave],
})
export class AuthComponent {
  activeItemIndex = 1
}
