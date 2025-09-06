import { i18n } from '@/i18n';
import { baseStyles } from '@/styles/base';

export abstract class LocalizedElement extends HTMLElement {
  private unsubscribe?: () => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    try {
      const sheets = this.shadowRoot!.adoptedStyleSheets || [];
      if (!sheets.includes(baseStyles)) {
        this.shadowRoot!.adoptedStyleSheets = [...sheets, baseStyles];
      }
    } catch {
    }
  }

  connectedCallback() {
    this.syncDir();
    this.render?.();
    this.unsubscribe = i18n.onChange(() => {
      this.syncDir();
      this.render?.();
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  protected t = i18n.t.bind(i18n);
  protected n = i18n.n.bind(i18n);
  protected d = i18n.d.bind(i18n);

  protected abstract render?(): void;

  private syncDir() {
    this.setAttribute('dir', document.documentElement.dir || 'ltr');
  }
}
