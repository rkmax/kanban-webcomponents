import { describe, it, expect, beforeEach } from 'vitest';
import { Store } from '@/store';
import type { AppState } from '@/types';

function mkState(): AppState {
  const id1 = 'a';
  const id2 = 'b';
  return {
    columns: { todo: [id1], doing: [], done: [id2] },
    cards: {
      [id1]: { id: id1, title: 'A', createdAt: Date.now() },
      [id2]: { id: id2, title: 'B', createdAt: Date.now() },
    },
  };
}

describe('Store', () => {
  let store: Store;
  beforeEach(() => {
    localStorage.clear();
    store = new Store(mkState());
  });

  it('ADD_CARD agrega una tarjeta al inicio de la columna', () => {
    store.dispatch({ type: 'ADD_CARD', column: 'todo', title: 'Nueva' });
    const s = store.getState();
    const firstId = s.columns.todo[0];
    expect(s.cards[firstId].title).toBe('Nueva');
  });

  it('MOVE_CARD mueve a otra columna en un índice', () => {
    const [moving] = store.getState().columns.todo;
    store.dispatch({ type: 'MOVE_CARD', cardId: moving, to: 'done', index: 0 });
    const s = store.getState();
    expect(s.columns.todo.includes(moving)).toBe(false);
    expect(s.columns.done[0]).toBe(moving);
  });

  it('EDIT_CARD actualiza título', () => {
    const id = store.getState().columns.todo[0];
    store.dispatch({ type: 'EDIT_CARD', cardId: id, title: 'Editado' });
    expect(store.getState().cards[id].title).toBe('Editado');
  });

  it('DELETE_CARD elimina la tarjeta de todas las columnas', () => {
    const id = store.getState().columns.todo[0];
    store.dispatch({ type: 'DELETE_CARD', cardId: id });
    const s = store.getState();
    expect(s.cards[id]).toBeUndefined();
    expect(s.columns.todo.includes(id)).toBe(false);
  });

  it('RESET restablece el estado a valores por defecto', () => {
    const before = JSON.stringify(store.getState());
    store.dispatch({ type: 'RESET' });
    const after = JSON.stringify(store.getState());
    expect(before === after).toBe(false);
  });
});
