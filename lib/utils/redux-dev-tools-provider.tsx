'use client'

import { attachReduxDevTools } from '@effector/redux-devtools-adapter'
import { getClientScope } from '@effector/next'

import { RootProps } from '@typs/components'

const clientScope = getClientScope()

if (clientScope) {
  attachReduxDevTools({
    scope: clientScope,
    name: 'spomen-client',
    trace: true,
  })
}

export function ReduxDevToolsAdapter({ children }: RootProps) {
  return <>{children}</>
}
