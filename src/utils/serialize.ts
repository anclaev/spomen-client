import { Role } from '../types/enums/role.enum'

export function serializeRole(role: Role): string {
  switch (role) {
    case Role.Public: {
      return 'Участник'
    }
    case Role.Administrator: {
      return 'Администратор'
    }
    default: {
      return 'Участник'
    }
  }
}
