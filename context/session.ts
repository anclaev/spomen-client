import { createDomain, createEvent, createStore } from 'effector'

import { ISession } from '@typs/interfaces/session'

const session = createDomain()

export const login = session.createEvent<ISession>()
export const logout = session.createEvent()

export const $session = session
  .createStore<ISession | null>(null)
  .on(login, (state, payload) => {
    state = { ...payload }
  })
  .on(logout, (state) => (state = null))

export const $isLogged = $session.map((session) => session !== null)
