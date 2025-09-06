export type PluralForms = {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};
export type MessageValue = string | PluralForms;
export type Messages = Record<string, MessageValue>;

const MESSAGES = {
  es: {
    'app.title': 'Kanban',
    'nav.home': 'Tablero',
    'nav.about': 'Acerca',

    'home.title': 'Tablero',
    'home.welcome': 'Bienvenido. Organiza tus tareas en el tablero.',
    'home.total': 'Total',
    'home.todo': 'Pendiente',
    'home.doing': 'En curso',
    'home.done': 'Completado',

    'board.cards': { one: '{count} tarjeta', other: '{count} tarjetas' },

    'column.todo': 'Pendiente',
    'column.doing': 'En curso',
    'column.done': 'Completado',
    'column.count': { one: '{count} tarjeta', other: '{count} tarjetas' },
    'column.dropzone': 'Zona de soltar {name}',
    'column.placeholder': 'Nueva tarjeta…',
    'column.add': 'Añadir',

    'card.edit': 'Editar',
    'card.delete': 'Eliminar',
    'card.created': 'Creado: {date}',
    'card.dialog.title': 'Editar tarjeta',
    'card.field.title': 'Título',
    'card.field.description': 'Descripción',
    'card.cancel': 'Cancelar',
    'card.save': 'Guardar',

    'about.title': 'Acerca',
    'about.desc': 'Tablero Kanban sencillo para organizar tareas en columnas.',
    'about.item.dragdrop': 'Arrastra y suelta tarjetas entre columnas',
    'about.item.autosave': 'Guardado automático en tu navegador',
    'about.item.privacy': 'Tus datos permanecen en tu dispositivo',

    'lang.label': 'Idioma',
  },
  en: {
    'app.title': 'Kanban',
    'nav.home': 'Home',
    'nav.about': 'About',

    'home.title': 'Home',
    'home.welcome': 'Welcome. Organize your tasks on the board.',
    'home.total': 'Total',
    'home.todo': 'To-Do',
    'home.doing': 'Doing',
    'home.done': 'Done',

    'board.cards': { one: '{count} card', other: '{count} cards' },

    'column.todo': 'To-Do',
    'column.doing': 'Doing',
    'column.done': 'Done',
    'column.count': { one: '{count} card', other: '{count} cards' },
    'column.dropzone': 'Drop zone {name}',
    'column.placeholder': 'New card…',
    'column.add': 'Add',

    'card.edit': 'Edit',
    'card.delete': 'Delete',
    'card.created': 'Created: {date}',
    'card.dialog.title': 'Edit card',
    'card.field.title': 'Title',
    'card.field.description': 'Description',
    'card.cancel': 'Cancel',
    'card.save': 'Save',

    'about.title': 'About',
    'about.desc': 'Simple Kanban board to organize tasks across columns.',
    'about.item.dragdrop': 'Drag and drop cards between columns',
    'about.item.autosave': 'Automatic save in your browser',
    'about.item.privacy': 'Your data stays on your device',

    'lang.label': 'Language',
  },
} as const;

type Locales = keyof typeof MESSAGES;
type BaseMessages = (typeof MESSAGES)['en'];
export type MessageKey = keyof BaseMessages & string;

const RTL_LANGS = new Set(['ar', 'fa', 'he', 'ps', 'ur']);
let locale: string = document.documentElement.lang || navigator.language || 'en';

function interpolate(str: string, vars?: Record<string, string | number>) {
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars && k in vars ? String(vars[k]) : ''));
}

type ChangeHandler = (next: string) => void;

class I18n {
  private subs = new Set<ChangeHandler>();

  get locale() {
    return locale;
  }

  onChange(fn: ChangeHandler) {
    this.subs.add(fn);
    return () => this.subs.delete(fn);
  }

  async setLocale(next: string) {
    if (!next || next === locale) return;
    locale = next;
    document.documentElement.lang = next;
    document.documentElement.dir = RTL_LANGS.has(next.split('-')[0]) ? 'rtl' : 'ltr';
    this.subs.forEach((fn) => fn(next));
  }

  t(key: MessageKey, vars?: Record<string, string | number>, opts?: { count?: number }): string {
    const lang = (MESSAGES as Record<string, Messages>)[locale] ? locale : locale.split('-')[0];
    const dict = (MESSAGES as Record<string, Messages>)[lang] || (MESSAGES as any).en;
    const entry = dict[key];

    if (typeof entry === 'string') {
      return interpolate(entry, vars);
    }

    const rules = new Intl.PluralRules(lang);
    const cat = rules.select(opts?.count ?? 0);
    const msg = entry?.[cat as keyof PluralForms] ?? entry?.other;
    const payload: Record<string, string | number> = { ...(vars || {}) };
    if (opts?.count != null) payload.count = opts.count;
    return interpolate(msg ?? String(key), payload);
  }

  n(value: number, options?: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat(locale, options).format(value);
  }

  d(value: number | Date, options?: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat(locale, options).format(value);
  }
}

export const i18n = new I18n();
export type { Locales };
