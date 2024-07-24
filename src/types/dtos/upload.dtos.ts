import { TuiFileLike } from '@taiga-ui/kit'

export type UploadFileDto = {
  file: TuiFileLike
  path: string
  private: boolean
  compress: boolean
  name?: string
}
