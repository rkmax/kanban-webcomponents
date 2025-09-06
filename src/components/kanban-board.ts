import { store } from '@/store';
import './kanban-column';
import { LocalizedElement } from '@/localized-element';

export class KanbanBoard extends LocalizedElement {
  static tag = 'kanban-board';
  #root: ShadowRoot;
  #unsub?: () => void;

  constructor() {
    super();
    this.#root = this.shadowRoot!;
  }
  connectedCallback() {
    super.connectedCallback?.();
    this.#unsub = store.subscribe(() => this.render());
    this.render();
  }
  disconnectedCallback() {
    this.#unsub?.();
  }

  render() {
    const total = Object.keys(store.getState().cards).length;
    this.#root.innerHTML = /* HTML */ `
      <style>
        :host {
          display: grid;
          gap: 12px;
        }
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .pill {
          padding: 6px 10px;
          border-radius: 999px;
          background: #eef2f7;
          font-size: 12px;
          color: #334155;
        }
        .columns {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          overflow: auto;
          padding-bottom: 8px;
        }
        .columns > kanban-column {
          flex: 1 1 320px;
        }
      </style>
      <div class="toolbar">
        <span class="pill">${this.t('board.cards', {}, { count: total })}</span>
      </div>
      <div class="columns">
        <kanban-column name="${this.t('column.todo')}" column-key="todo"></kanban-column>
        <kanban-column name="${this.t('column.doing')}" column-key="doing"></kanban-column>
        <kanban-column name="${this.t('column.done')}" column-key="done"></kanban-column>
      </div>
    `;
  }
}

customElements.define(KanbanBoard.tag, KanbanBoard);
