/** Used to match words to create compound words. */
let reWords = (function() {
  let upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
    lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

  return RegExp(
    upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g'
  );
}());

function wrap(str: string, fn: any): string {
  return str.match(reWords).reduce(fn, '');
}

export let transformers = {
  camel(str: string): string {
    return wrap(str, (result, word, index) => {
      let fn = index ? 'toUpperCase' : 'toLowerCase';
      return result + word.charAt(0)[fn]() + word.slice(1);
    });
  },
  capCamel(str: string): string {
    return wrap(str, (result, word, index) => {
      return result + word.charAt(0).toUpperCase() + word.slice(1);
    });
  },
  upper(str: string): string {
    return wrap(str, (result, word, index) => {
      return result + (index ? '_' : '') + word.toUpperCase();
    });
  },
  kebab(str: string): string {
    return wrap(str, (result, word, index) => {
      return result + (index ? '-' : '') + word.toLowerCase();
    });
  },
  snake(str: string): string {
    return wrap(str, (result, word, index) => {
      return result + (index ? '_' : '') + word.toLowerCase();
    });
  }
};

export function naming(key: string, transforms?: string | Array<string>): string {
  let result = key;

  if (transforms) {
    [].concat(transforms).forEach(transform => {
      if (transform in transformers) result = transformers[transform](result);
    });
  }

  return result;
}
