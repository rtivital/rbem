function isString(value) {
  return typeof value === 'string' && value.length;
}

export function applyModifiers(instance, modifiers, separator = '--') {
  const selector = typeof instance === 'function' && instance.bemModule
    ? instance()
    : instance;

  if (isString(modifiers)) {
    return `${selector} ${selector}${separator}${modifiers}`;
  }

  if (Array.isArray(modifiers)) {
    let { length } = modifiers;
    if (length === 0) { return selector; }

    let result = selector;
    while (length--) {
      const modifier = modifiers[length];
      if (isString(modifier)) {
        result += ` ${selector}${separator}${modifier}`;
      }
    }

    return result;
  }

  if (typeof modifiers === 'object' && modifiers !== null) {
    const keys = Object.keys(modifiers);
    let { length } = keys;

    let result = selector;
    while (length--) {
      const key = keys[length];
      if (modifiers[key] && isString(key)) {
        result += ` ${selector}${separator}${key}`;
      }
    }

    return result;
  }

  return '';
}

export function block(b, separator = '__') {
  const element = function element(e) {
    if (!isString(b)) { return ''; }
    return isString(e) ? `${b}${separator}${e}` : b;
  };

  Object.defineProperty(element, 'bemModule', { value: true });

  return element;
}
