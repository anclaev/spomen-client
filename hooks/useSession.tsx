'use client'
import { useUnit } from 'effector-react'

import { $isLogged, $session } from '@context/session'

export const useSession = () => {
  const session = useUnit($session)
  const isLogged = useUnit($isLogged)

  return { session, isLogged }
}
