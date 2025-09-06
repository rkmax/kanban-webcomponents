export type RouteHandler = (params: Record<string, string>) => void;

interface Route {
  pattern: RegExp;
  keys: string[];
  handler: RouteHandler;
}

export class Router {
  #routes: Route[] = [];
  #notFound?: () => void;
  #currentPath = '';

  add(path: string, handler: RouteHandler) {
    const { pattern, keys } = this.#compile(path);
    this.#routes.push({ pattern, keys, handler });
    return this;
  }

  notFound(handler: () => void) {
    this.#notFound = handler;
    return this;
  }

  start() {
    window.addEventListener('popstate', () => this.#resolve(location.pathname));
    document.addEventListener('click', (e) => {
      const a = (e.target as HTMLElement)?.closest('a[data-link]') as HTMLAnchorElement | null;
      if (a && a.href && a.origin === location.origin) {
        e.preventDefault();
        this.go(a.pathname);
      }
    });
    this.#resolve(location.pathname);
  }

  go(path: string) {
    if (path === this.#currentPath) return;
    history.pushState({}, '', path);
    this.#resolve(path);
  }

  #resolve(path: string) {
    this.#currentPath = path;
    for (const r of this.#routes) {
      const match = r.pattern.exec(path);
      if (match) {
        const params: Record<string, string> = {};
        r.keys.forEach((k, i) => (params[k] = decodeURIComponent(match[i + 1])));
        r.handler(params);
        return;
      }
    }
    this.#notFound?.();
  }

  #compile(path: string) {
    const keys: string[] = [];
    const regex = path.replace(/\//g, '\\/').replace(/:(\w+)/g, (_, k) => {
      keys.push(k);
      return '([^/]+)';
    });
    return { pattern: new RegExp('^' + regex + '$'), keys };
  }
}
