import { DomSanitizer } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'iframeUrl',
  standalone: true,
})
export class IFrameUrlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}

  transform(url?: string): any {
    return url ? this.domSanitizer.bypassSecurityTrustResourceUrl(url) : null
  }
}
