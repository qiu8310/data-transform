# data-transform
[![NPM version](https://badge.fury.io/js/data-transform.svg)](https://npmjs.org/package/data-transform)
[![Build Status](https://travis-ci.org/qiu8310/data-transform.svg?branch=master)](https://travis-ci.org/qiu8310/data-transform)
[![Coverage Status](https://coveralls.io/repos/qiu8310/data-transform/badge.png)](https://coveralls.io/r/qiu8310/data-transform)

将源数据转换成一个全新的规范的数据


## 背景

后端 API 接口吐出的数据，可能由于格式或者命名和前端的代码风格不统一，会使得前端的代码不够优雅，
也常常会引起 lint 不通过等等...

通过 `data-transform` 可以将后端 API 吐出的数据转换成前端想要的格式。


## 使用

* node

  ```js
  import dataTransform from 'data-transform';

  let result = dataTransform(data, config);
  ```

* browser

  - 先在 html 中引用脚本

    ```html
    <script src="./node_module/data-transform/dist/data-transform.bundle.min.js"></script>
    ```
  - 上面脚本会在全局中导入一个 DT 变量，在 JS 文件中就可以这样用

    ```js
    var result = DT.dataTransform(data, config);
    ```

## API

```typescript
interface TransformConfig {
    map?: Function;
    naming?: string | Array<string>; // 支持 kebab, camel, capCamel, upper, snake
    drop?: string | Array<string>;
    alias?: Object;
    computed?: Object;
}

dataTransform(data: any, config: TransformConfig);
```

## Example

* naming：keys 命名转换

  ```js
  dataTransform({foo_bar: 1, 'bar bar': 2}, {naming: 'camel'});

  // => {fooBar: 1, barBar: 2}
  ```

* drop：删除不用的 keys

  ```js
  dataTransform(
    {list: [{a: 'a1', b: 'b1'}, {a: 'a2', b: 'b2'}]},
    {drop: ['list.[].b']}
  );

  // => {list: [{a: 'a1'}, {a: 'a2'}]}
  ```

* alias: 别名替换

  ```js
  dataTransform(
    [{b: 'a1'}, {b: 'a2'}],
    {alias: {
      '[].b': 'a'
    }}
  );

  // => [{a: 'a1'}, {a: 'a2'}]
  ```

* computed: 生成新的 keys

  ```js
  dataTransform({a: 'a'}, {
    computed: {
      b: function () { return this.a + 'b'; }
    }
  });

  // => {a: 'a', b: 'ab'}
  ```

* map: 类似于数组的 map 方法，即输入一个对象，返回另一个对象

  ```js
  dataTransform({a: 'b'}, {map: function (target) {
    target.a = 'a';
    return target;
  });

  // => {a: 'a'}
  ```