import { describe, it, expect, beforeEach } from 'vitest';
import { Router } from '@/router';

function clickAnchor(pathname: string) {
  const a = document.createElement('a');
  a.setAttribute('data-link', '');
  // Use the current origin to ensure it matches location.origin
  a.href = location.origin + pathname;
  document.body.appendChild(a);
  a.click();
}

describe('Router', () => {
  let router: Router;
  let log: string[];

  beforeEach(() => {
    // jsdom no implementa history.pushState por defecto; Vitest sí simula.
    history.pushState({}, '', '/');
    document.body.innerHTML = '';
    log = [];
    router = new Router();
    router
      .add('/', () => {
        log.push('home');
      })
      .add('/about', () => {
        log.push('about');
      })
      .notFound(() => {
        log.push('404');
      });
    router.start();
  });

  it('resuelve ruta inicial', () => {
    expect(log.at(-1)).toBe('home');
  });

  it('navega con go()', () => {
    router.go('/about');
    expect(log.at(-1)).toBe('about');
  });

  it('intercepta click en <a data-link>', () => {
    router.go('/');
    clickAnchor('/about');
    expect(log.at(-1)).toBe('about');
  });

  it('maneja 404', () => {
    router.go('/nope');
    expect(log.at(-1)).toBe('404');
  });
});
