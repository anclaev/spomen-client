import { Permission, Role } from '@enums'

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

export function serializePermissions(permissions: string[]): Permission[] {
  return permissions.map((permission) => {
    switch (permission) {
      case 'Публичный': {
        return Permission.Public
      }
      case 'Воспоминание': {
        return Permission.MemberOnly
      }
      case 'Чат': {
        return Permission.ChatOnly
      }
      case 'Личный': {
        return Permission.OwnerOnly
      }
      default: {
        return Permission.Public
      }
    }
  })
}
