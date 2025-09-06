import { store } from '@/store';
import { KanbanCard } from './kanban-card';
import type { ColumnKey } from '@/types';
import { LocalizedElement } from '@/localized-element';

export class KanbanColumn extends LocalizedElement {
  static tag = 'kanban-column';
  static get observedAttributes() {
    return ['name', 'column-key'];
  }
  #root: ShadowRoot;
  name = '';
  columnKey!: ColumnKey;
  #unsub?: () => void;

  constructor() {
    super();
    this.#root = this.shadowRoot!;
  }
  attributeChangedCallback(n: string, _o: string | null, v: string | null) {
    if (n === 'name' && v) this.name = v;
    if (n === 'column-key' && v) this.columnKey = v as ColumnKey;
    this.render();
  }
  connectedCallback() {
    super.connectedCallback?.();
    this.#unsub = store.subscribe(() => this.render());
    this.render();
  }
  disconnectedCallback() {
    this.#unsub?.();
  }

  #addCard = (ev: Event) => {
    ev.preventDefault();
    const input = this.#root.getElementById('newTitle') as HTMLInputElement;
    const title = input.value.trim();
    if (!title) return;
    store.dispatch({ type: 'ADD_CARD', column: this.columnKey, title });
    input.value = '';
  };

  render() {
    const ids = this.columnKey ? (store.getState().columns[this.columnKey] ?? []) : [];
    this.#root.innerHTML = /* HTML */ `
      <style>
        :host {
          display: grid;
          grid-template-rows: auto 1fr auto;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px;
          gap: 10px;
          min-width: 280px;
        }
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .list {
          display: grid;
          gap: 8px;
          min-height: 60px;
        }
        form {
          display: flex;
          gap: 8px;
        }
        input {
          flex: 1;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 8px;
          font: inherit;
          color: inherit;
          background: #ffffff;
          caret-color: currentColor;
        }
        input::placeholder {
          color: #94a3b8;
        }
        button {
          border: 1px solid #e2e8f0;
          background: white;
          padding: 8px 10px;
          border-radius: 10px;
        }
        .drop {
          outline: 2px dashed transparent;
          outline-offset: -6px;
          border-radius: 12px;
          padding: 6px;
        }
        .drop.active {
          outline-color: #94a3b8;
          background: #eef2f7;
        }
        .count {
          color: #64748b;
          font-size: 12px;
        }
        form button {
          background: #2563eb;
          color: #ffffff;
          border-color: #1d4ed8;
        }
        form button:hover {
          background: #1d4ed8;
        }
      </style>
      <header>
        <h3>${this.name}</h3>
        <span class="count">${this.t('column.count', {}, { count: ids.length })}</span>
      </header>
      <div
        class="list drop"
        id="dropzone"
        aria-label="${this.t('column.dropzone', { name: this.name })}"
        tabindex="0"
      ></div>
      <form id="addForm" autocomplete="off">
        <input id="newTitle" placeholder="${this.t('column.placeholder')}" />
        <button>${this.t('column.add')}</button>
      </form>
    `;

    const list = this.#root.getElementById('dropzone') as HTMLElement;
    list.innerHTML = '';
    for (const id of ids) {
      const card = document.createElement(KanbanCard.tag) as KanbanCard;
      card.setAttribute('card-id', id);
      list.appendChild(card);
    }

    const activate = (on: boolean) => list.classList.toggle('active', on);
    const allow = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('text/kanban-card')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }
    };

    list.addEventListener('dragenter', (e) => {
      allow(e);
      activate(true);
    });
    list.addEventListener('dragover', (e) => {
      allow(e);
      const after = getDropIndex(list, e.clientY);
      (list as any).__dropIndex = after;
    });
    list.addEventListener('dragleave', () => activate(false));
    list.addEventListener('drop', (e) => {
      e.preventDefault();
      activate(false);
      const id = e.dataTransfer?.getData('text/kanban-card');
      if (!id) return;
      const index = (list as any).__dropIndex ?? undefined;
      store.dispatch({ type: 'MOVE_CARD', cardId: id, to: this.columnKey, index });
    });

    this.#root.getElementById('addForm')?.addEventListener('submit', this.#addCard);
  }
}

function getDropIndex(container: HTMLElement, mouseY: number): number {
  const items = Array.from(container.querySelectorAll<HTMLElement>(KanbanCard.tag));
  for (let i = 0; i < items.length; i++) {
    const r = items[i].getBoundingClientRect();
    const midpoint = r.top + r.height / 2;
    if (mouseY < midpoint) return i;
  }
  return items.length;
}

customElements.define(KanbanColumn.tag, KanbanColumn);
