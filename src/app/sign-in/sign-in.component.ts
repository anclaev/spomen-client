import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import * as VKID from '@vkid/sdk'

@Component({
  selector: 'spomen-sign-in',
  standalone: true,
  imports: [],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements AfterViewInit {
  @ViewChild('VkIdSdkOneTap') VkIdSdkOneTap!: ElementRef<HTMLDivElement>

  private vkIdOneTap = new VKID.OneTap()

  ngAfterViewInit(): void {
    if (this.VkIdSdkOneTap) {
      this.vkIdOneTap.render({
        container: this.VkIdSdkOneTap.nativeElement,
        scheme: VKID.Scheme.DARK,
        lang: VKID.Languages.RUS,
        styles: {
          borderRadius: 50,
        },
      })
    }
  }
}
