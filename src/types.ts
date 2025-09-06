export type ID = string;
export type ColumnKey = 'todo' | 'doing' | 'done';

export interface Card {
  id: ID;
  title: string;
  description?: string;
  createdAt: number;
}

export interface AppState {
  columns: Record<ColumnKey, ID[]>;
  cards: Record<ID, Card>;
}

export type Action =
  | { type: 'ADD_CARD'; column: ColumnKey; title: string; description?: string }
  | { type: 'MOVE_CARD'; cardId: ID; to: ColumnKey; index?: number }
  | { type: 'EDIT_CARD'; cardId: ID; title: string; description?: string }
  | { type: 'DELETE_CARD'; cardId: ID }
  | { type: 'RESET' };
