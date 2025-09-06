import { Router } from './router';
import './views/home-view';
import './views/about-view';
import { LocalizedElement } from '@/localized-element';
import '@/components/app-header';

export class AppShell extends LocalizedElement {
  static tag = 'app-shell';
  #root: ShadowRoot;
  #router = new Router();
  #outletEl?: HTMLElement;

  constructor() {
    super();
    this.#root = this.shadowRoot!;
  }
  connectedCallback() {
    super.connectedCallback?.();
    this.render();
    this.#setupRoutes();
    this.#router.start();
  }

  #setupRoutes() {
    const mount = (el: HTMLElement) => {
      const outlet = this.#outletEl ?? (this.#root.getElementById('outlet') as HTMLElement);
      this.#outletEl = outlet;
      outlet.innerHTML = '';
      outlet.appendChild(el);
      this.#highlightActive();
    };

    this.#router
      .add('/', () => mount(document.createElement('home-view')))
      .add('/about', () => mount(document.createElement('about-view')))
      .notFound(() => mount(document.createElement('home-view')));
  }

  #highlightActive() {
    const links = this.#root.querySelectorAll('a[data-link]');
    links.forEach((a) => a.removeAttribute('aria-current'));
    const current = this.#root.querySelector(`a[data-link][href="${location.pathname}"]`);
    current?.setAttribute('aria-current', 'page');
  }

  render() {
    if (!this.#outletEl) {
      this.#root.innerHTML = /* HTML */ `
        <style>
          :host { display: grid; gap: 12px; }
          #outlet { display: block; }
        </style>
        <app-header></app-header>
        <section id="outlet" aria-live="polite"></section>
      `;
      this.#outletEl = this.#root.getElementById('outlet') as HTMLElement;
    }
  }
}

customElements.define(AppShell.tag, AppShell);
