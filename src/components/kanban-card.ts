import { store } from '@/store';
import { escapeAttr, escapeHtml } from '@/utils/dom';
import type { ID } from '@/types';
import { LocalizedElement } from '@/localized-element';

export class KanbanCard extends LocalizedElement {
  static tag = 'kanban-card';
  static get observedAttributes() {
    return ['card-id'];
  }
  #root: ShadowRoot;
  cardId!: ID;

  constructor() {
    super();
    this.#root = this.shadowRoot!;
  }
  attributeChangedCallback(name: string, _old: string | null, val: string | null) {
    if (name === 'card-id' && val) {
      this.cardId = val as ID;
      this.render();
    }
  }
  connectedCallback() {
    super.connectedCallback?.();
    this.render();
  }

  #onDelete = () => store.dispatch({ type: 'DELETE_CARD', cardId: this.cardId });
  #onEdit = (ev: Event) => {
    ev.preventDefault();
    const title = (this.#root.getElementById('title') as HTMLInputElement).value;
    const description = (this.#root.getElementById('desc') as HTMLTextAreaElement).value;
    store.dispatch({ type: 'EDIT_CARD', cardId: this.cardId, title, description });
    (this.#root.getElementById('details') as HTMLDialogElement).close();
  };

  render() {
    const card = store.getState().cards[this.cardId];
    if (!card) return;
    this.#root.innerHTML = /* HTML */ `
      <style>
        :host {
          display: block;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px;
          background: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          cursor: grab;
        }
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }
        .actions {
          display: flex;
          gap: 6px;
        }
        button {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
        }
        button:hover {
          background: #eef2f7;
        }
        dialog {
          border: none;
          border-radius: 12px;
          padding: 0;
          width: 520px;
          max-width: 90vw;
          background: var(--surface, #ffffff);
          color: inherit;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.35);
        }
        form {
          padding: 20px;
          display: grid;
          gap: 14px;
        }
        form h3 {
          margin: 0 0 6px;
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
        }
        label {
          display: grid;
          gap: 6px;
          color: #475569;
          font-size: 12px;
        }
        label input,
        label textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 12px;
          font: inherit;
          font-size: 14px;
          color: inherit;
          background: #ffffff;
          caret-color: currentColor;
        }
        input:focus-visible,
        textarea:focus-visible {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
        textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.4;
        }
        input::placeholder,
        textarea::placeholder {
          color: #94a3b8;
        }
        footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 6px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
        }
        footer button {
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 10px;
        }
        footer button[value='default'] {
          background: #2563eb;
          color: #ffffff;
          border-color: #1d4ed8;
        }
        footer button[value='default']:hover {
          background: #1d4ed8;
        }
        footer button[value='cancel'] {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }
      </style>
      <header>
        <h4>${escapeHtml(card.title)}</h4>
        <div class="actions">
          <button
            type="button"
            id="edit"
            aria-label="${this.t('card.edit')}"
            title="${this.t('card.edit')}"
          >
            ✏️
          </button>
          <button
            type="button"
            id="del"
            aria-label="${this.t('card.delete')}"
            title="${this.t('card.delete')}"
          >
            🗑️
          </button>
        </div>
      </header>
      <div class="meta">
        ${this.t('card.created', {
          date: this.d(card.createdAt, { dateStyle: 'medium', timeStyle: 'short' }),
        })}
      </div>
      <dialog id="details">
        <form method="dialog" id="editForm">
          <h3>${this.t('card.dialog.title')}</h3>
          <label
            >${this.t('card.field.title')}<input id="title" value="${escapeAttr(card.title)}"
          /></label>
          <label
            >${this.t('card.field.description')}<textarea id="desc" rows="5">
${escapeHtml(card.description ?? '')}</textarea
            >
          </label>
          <footer>
            <button value="cancel">${this.t('card.cancel')}</button>
            <button id="save" value="default">${this.t('card.save')}</button>
          </footer>
        </form>
      </dialog>
    `;

    (this as HTMLElement).draggable = true;
    this.addEventListener('dragstart', (e) => {
      (e.dataTransfer as DataTransfer).setData('text/kanban-card', this.cardId);
      (e.dataTransfer as DataTransfer).effectAllowed = 'move';
    });

    this.#root.getElementById('del')?.addEventListener('click', this.#onDelete);
    this.#root
      .getElementById('edit')
      ?.addEventListener('click', () =>
        (this.#root.getElementById('details') as HTMLDialogElement).showModal()
      );
    this.#root.getElementById('editForm')?.addEventListener('submit', this.#onEdit);
  }
}

customElements.define(KanbanCard.tag, KanbanCard);
