import type { Action, AppState, Card, ColumnKey, ID } from './types';

function uid(): ID {
  // crypto.randomUUID no está en jsdom en tests; hace fallback.
  return (globalThis.crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function defaultState(): AppState {
  const c1 = uid();
  const c2 = uid();
  return {
    columns: { todo: [c1], doing: [], done: [c2] },
    cards: {
      [c1]: {
        id: c1,
        title: 'Explorar Web Components',
        description: 'Prototipo con Shadow DOM',
        createdAt: Date.now(),
      },
      [c2]: {
        id: c2,
        title: 'Configurar build TypeScript',
        description: 'Vite + Vitest',
        createdAt: Date.now(),
      },
    },
  };
}

export type Listener = () => void;

export class Store {
  #state: AppState;
  #listeners = new Set<Listener>();

  constructor(initial: AppState) {
    this.#state = initial;
  }
  getState(): AppState {
    return this.#state;
  }
  subscribe(fn: Listener): () => void {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }
  #emit() {
    this.#listeners.forEach((l) => l());
  }

  #save() {
    try {
      localStorage.setItem('kanban-state', JSON.stringify(this.#state));
    } catch {}
  }

  dispatch(action: Action) {
    const s = this.#state;
    switch (action.type) {
      case 'ADD_CARD': {
        const id = uid();
        s.cards[id] = {
          id,
          title: action.title.trim() || 'Sin título',
          description: action.description?.trim(),
          createdAt: Date.now(),
        } as Card;
        s.columns[action.column].unshift(id);
        break;
      }
      case 'MOVE_CARD': {
        const cols: ColumnKey[] = ['todo', 'doing', 'done'];
        for (const c of cols) {
          const idx = s.columns[c].indexOf(action.cardId);
          if (idx >= 0) s.columns[c].splice(idx, 1);
        }
        const target = s.columns[action.to];
        const at = Math.max(0, Math.min(action.index ?? target.length, target.length));
        target.splice(at, 0, action.cardId);
        break;
      }
      case 'EDIT_CARD': {
        const card = s.cards[action.cardId];
        if (card) {
          card.title = action.title.trim() || card.title;
          card.description = action.description?.trim();
        }
        break;
      }
      case 'DELETE_CARD': {
        const cols: ColumnKey[] = ['todo', 'doing', 'done'];
        for (const c of cols) {
          const idx = s.columns[c].indexOf(action.cardId);
          if (idx >= 0) s.columns[c].splice(idx, 1);
        }
        delete s.cards[action.cardId];
        break;
      }
      case 'RESET': {
        this.#state = defaultState();
        this.#save();
        this.#emit();
        return;
      }
    }
    this.#save();
    this.#emit();
  }
}

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem('kanban-state');
    return raw ? (JSON.parse(raw) as AppState) : null;
  } catch {
    return null;
  }
}

export const store = new Store(loadState() ?? defaultState());
