const sheet = new CSSStyleSheet();
sheet.replaceSync(/* CSS */ `
  :host {
    color: inherit;
    font: inherit;
    color-scheme: light dark;
  }
  *, *::before, *::after { box-sizing: border-box; }
  ::slotted(*) { color: inherit; font: inherit; }
  :host([hidden]) { display: none !important; }
  button, input, select, textarea, label { color: inherit; font: inherit; }
  input, select, textarea {
    background: var(--field-bg, #ffffff);
    color: inherit;
    border-color: var(--field-border, #cbd5e1);
    caret-color: currentColor;
  }
  input::placeholder, textarea::placeholder { color: var(--placeholder-fg, #94a3b8); }
  :host(:where(button, [type="button"], [type="submit"], [type="reset"])):not(:disabled) { cursor: pointer; }
  :host(:where(button, input, select, textarea):disabled) { opacity: .6; cursor: not-allowed; }
  :host(:where(:focus-visible, *:focus-visible)) {
    outline: 2px solid var(--focus-ring, Highlight);
    outline-offset: 2px;
  }
`);

export const baseStyles = sheet;
