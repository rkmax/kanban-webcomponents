import { store } from '@/store';
import { LocalizedElement } from '@/localized-element';

export class KanbanTotals extends LocalizedElement {
  static tag = 'kanban-totals';
  #unsub?: () => void;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.#unsub = store.subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() {
    this.#unsub?.();
  }

  protected render() {
    const s = store.getState();
    const total = Object.keys(s.cards).length;
    const todo = s.columns.todo.length;
    const doing = s.columns.doing.length;
    const done = s.columns.done.length;
    this.shadowRoot!.innerHTML = /* HTML */ `
      <style>
        :host {
          display: block;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }
        .card {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          background: white;
        }
        h2 {
          margin-top: 0;
        }
      </style>
      <div class="grid">
        <div class="card">
          <strong>${this.t('home.total')}</strong>
          <div>${total}</div>
        </div>
        <div class="card">
          <strong>${this.t('home.todo')}</strong>
          <div>${todo}</div>
        </div>
        <div class="card">
          <strong>${this.t('home.doing')}</strong>
          <div>${doing}</div>
        </div>
        <div class="card">
          <strong>${this.t('home.done')}</strong>
          <div>${done}</div>
        </div>
      </div>
    `;
  }
}

customElements.define(KanbanTotals.tag, KanbanTotals);
