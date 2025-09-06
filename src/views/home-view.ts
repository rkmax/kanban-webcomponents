import { LocalizedElement } from '@/localized-element';
import '@/components/kanban-totals';
import '@/components/kanban-board';

export class HomeView extends LocalizedElement {
  static tag = 'home-view';
  #root: ShadowRoot;
  constructor() {
    super();
    this.#root = this.shadowRoot!;
  }
  connectedCallback() {
    super.connectedCallback?.();
    this.render();
  }
  disconnectedCallback() {}
  render() {
    this.#root.innerHTML = /* HTML */ `
      <style>
        :host {
          display: block;
        }
        .section {
          margin-block: 10px 16px;
        }
      </style>
      <h2>${this.t('home.title')}</h2>
      <p>${this.t('home.welcome')}</p>
      <kanban-totals class="section"></kanban-totals>
      <kanban-board></kanban-board>
    `;
  }
}
customElements.define(HomeView.tag, HomeView);
