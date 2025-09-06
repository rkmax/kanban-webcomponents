import { LocalizedElement } from '@/localized-element';
import { i18n } from '@/i18n';

export class AppHeader extends LocalizedElement {
  static tag = 'app-header';

  constructor() {
    super();
  }

  protected render() {
    this.shadowRoot!.innerHTML = /* HTML */ `
      <style>
        :host {
          display: block;
        }
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        nav {
          display: flex;
          gap: 10px;
        }
        a {
          color: inherit;
          text-decoration: none;
          border: 1px solid #e2e8f0;
          background: white;
          padding: 8px 12px;
          border-radius: 10px;
        }
        a:hover {
          background: #eef2f7;
        }
        .lang {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }
        select {
          border: 1px solid #e2e8f0;
          background: white;
          padding: 6px 8px;
          border-radius: 10px;
          font: inherit;
        }
      </style>
      <header>
        <strong>${this.t('app.title')}</strong>
        <nav>
          <a data-link href="/">${this.t('nav.home')}</a>
          <a data-link href="/about">${this.t('nav.about')}</a>
        </nav>
        <label class="lang">
          <span>🌐 ${this.t('lang.label')}:</span>
          <select id="lang">
            <option value="es" ${i18n.locale.startsWith('es') ? 'selected' : ''}>Español</option>
            <option value="en" ${i18n.locale.startsWith('en') ? 'selected' : ''}>English</option>
          </select>
        </label>
      </header>
    `;
    this.shadowRoot!.getElementById('lang')?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value;
      i18n.setLocale(val);
    });
  }
}

customElements.define(AppHeader.tag, AppHeader);
