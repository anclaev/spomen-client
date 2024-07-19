import { TuiFileLike } from '@taiga-ui/kit'

export type UploadAvatarDto = {
  file: TuiFileLike
  id?: string
}

export type RemoveAvatarDto = {
  id?: string
}
