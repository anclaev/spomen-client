import { Router } from '@angular/router'

export const getCurrentPath = (router: Router): string =>
  router.getCurrentNavigation()!.extractedUrl.toString()
