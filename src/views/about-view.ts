import { LocalizedElement } from '@/localized-element';

export class AboutView extends LocalizedElement {
  static tag = 'about-view';
  #root: ShadowRoot;
  constructor() {
    super();
    this.#root = this.shadowRoot!;
  }
  connectedCallback() {
    super.connectedCallback?.();
    this.render();
  }
  render() {
    this.#root.innerHTML = /* HTML */ ` <style>
        .card {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          background: white;
        }
      </style>
      <div class="card">
        <h2>${this.t('about.title')}</h2>
        <p>${this.t('about.desc')}</p>
        <ul>
          <li>${this.t('about.item.dragdrop')}</li>
          <li>${this.t('about.item.autosave')}</li>
          <li>${this.t('about.item.privacy')}</li>
        </ul>
      </div>`;
  }
}
customElements.define(AboutView.tag, AboutView);
