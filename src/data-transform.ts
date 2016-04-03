export declare interface TransformConfig {
  map?: Function;
  naming?: string | Array<string>;
  drop?: string | Array<string>;
  alias?: Object;
  computed?: Object;
}

import {naming} from './naming';
export {transformers, naming} from './naming';

function isArray(target: any) : boolean {
  return Array.isArray(target);
}

function isObject(target: any) : boolean {
  return Object.prototype.toString.call(target) === '[object Object]';
}

function walk(
  target: any,
  callback: Function,
  _lastPath: string = '',
  _paths: Array<string> = []
): any {

  let result = target;
  if (_lastPath) _paths = _paths.concat(_lastPath);

  if (isArray(target)) {
    result = [];
    for (let l = target.length, i = 0; i < l; i++) {
      result.push(walk(target[i], callback, '[]', _paths));
    }
  } else if (isObject(target)) {
    result = {};
    Object.keys(target).forEach(key => {
      callback(key, walk(target[key], callback, key, _paths), _paths, target, result);
    });
  }
  return result;
}

function compileComputed(computed?: Object): Object {
  let result = {}, parts, allPathStr, pathStr, lastKey;
  if (computed) {
    for (allPathStr in computed) {
      parts = allPathStr.split('.');
      lastKey = parts.pop();
      pathStr = parts.join('.');
      if (!result[pathStr]) result[pathStr] = [];
      result[pathStr].push({
        key: lastKey,
        fn: computed[allPathStr]
      });
    }
  }
  return result;
}

export function dataTransform(source: any, config: TransformConfig = {}): any {
  let computed = compileComputed(config.computed);
  let drop = config.drop ? [].concat(config.drop) : [];
  let alias = config.alias || {};

  let result = walk(source, (key, value, paths, target, result) => {
    let pathStr = paths.join('.');
    let allPathStr = paths.concat(key).join('.');

    // 先拷贝
    if (drop.indexOf(allPathStr) < 0) {
      result[naming(allPathStr in alias ? alias[allPathStr] : key, config.naming)] = value;
    }

    // 再来计算新的 key
    if (pathStr in computed) {
      computed[pathStr].forEach(c => {
        let key = naming(c.key, config.naming);
        // computed 表示只有没有才会创建，如果已经有了就不创建
        if (!(key in result)) result[key] = c.fn.call(target, target, c.key, paths, source);
      });
    }

    return result;
  });

  return config.map ? config.map(result) : result;
}

export default dataTransform;
