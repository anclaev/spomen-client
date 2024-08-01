'use strict'

module.exports = {
  types: [
    {
      value: 'build',
      name: 'build:     Сборка проекта или изменения внешних зависимостей',
    },
    { value: 'ci', name: 'ci:        Настройка CI и работа со скриптами' },
    { value: 'docs', name: 'docs:      Обновление документации' },
    { value: 'feat', name: 'feat:      Добавление нового функционала' },
    { value: 'fix', name: 'fix:       Исправление ошибок' },
    {
      value: 'perf',
      name: 'perf:      Изменения, направленные на улучшение производительности',
    },
    {
      value: 'refactor',
      name:
        'refactor:  Правки кода без исправления ошибок или добавления новых функций',
    },
    { value: 'revert', name: 'revert:    Откат на предыдущие коммиты' },
    {
      value: 'style',
      name:
        'style:     Правки по кодстайлу (табы, отступы, точки, запятые и т.д.)',
    },
    { value: 'test', name: 'test:      Добавление тестов' },
  ],

  scopes: [
    { name: 'app' },
    { name: 'auth' },
    { name: 'chats' },
    { name: 'common' },
    { name: 'core' },
    { name: 'dashboard' },
    { name: 'events' },
    { name: 'memories' },
    { name: 'profile' },
    { name: 'timelines' },
    { name: 'uploads' },
    { name: 'e2e' },
  ],

  // Возможность задать специальную область для определенного типа коммита (пример для 'fix')
  /*
  scopeOverrides: {
    fix: [
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */

  // Вопросы по-умолчанию
  messages: {
    type: 'Какие изменения вы вносите?',
    scope: '\nВыберите область, которую вы изменили (опционально):',
    // Если allowCustomScopes в true
    customScope: 'Укажите призвольную область:',
    subject: 'Напишите короткое описание в повелительном наклонении:\n',
    body:
      'Напишите подробноеописание (опционально). Используйте "|" для новой строки:\n',
    breaking: 'Список критических изменений (опционально):\n',
    footer:
      'Место для метаданных. Например: SECRETMRKT-700, SECRETMRKT-800:\n',
    confirmCommit: 'Вас устраивает получившийся коммит?',
  },

  // Разрешим собственную область
  allowCustomScopes: true,

  // Запрет на breaking changes
  allowBreakingChanges: false,

  // Префикс для нижнего колонтитула
  footerPrefix: 'META:',

  // limit subject length
  subjectLimit: 72,
}
