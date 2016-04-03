import {dataTransform as dt} from './data-transform';

describe('dataTransform', () => {

  describe('alias', () => {
    it('alias object key `a` to `b`', () => {
      let actual = dt({a: 'bb'}, {alias: {'a': 'b'}});
      let expected = {b: 'bb'};

      expect(actual).toEqual(expected);
    });

    it('alias nested object key `a` to `b`', () => {
      let actual = dt({foo: {a: 'bb'}}, {alias: {'foo.a': 'b'}});
      let expected = {foo: {b: 'bb'}};

      expect(actual).toEqual(expected);
    });

    it('alias array object key `a` to `b`', () => {
      let actual = dt({foo: [
        {a: 'a1'},
        {a: 'a2'}
      ]}, {alias: {'foo.[].a': 'b'}});
      let expected = {foo: [{b: 'a1'}, {b: 'a2'}]};

      expect(actual).toEqual(expected);
    });
  });

  describe('drop', () => {
    it('drop object key `a`', () => {
      expect(dt({a: 'aa', b: 'bb'}, {drop: 'a'}))
        .toEqual({b: 'bb'});
    });

    it('drop object keys `a` and `b`', () => {
      expect(dt({a: 'aa', b: 'bb'}, {drop: ['a', 'b']}))
        .toEqual({});
    });

    it('drop nested object keys', () => {
      expect(dt({foo: {a: 'aa', b: 'bb'}}, {drop: ['foo.a', 'foo.b']}))
        .toEqual({foo: {}});
    });

    it('drop array object keys', () => {
      expect(dt([{a: 'a1'}, {a: 'a2', b: 'b'}], {drop: ['[].a']}))
        .toEqual([{}, {b: 'b'}]);
    });
  });

  describe('computed', () => {
    it('compute new key `b` for object', () => {
      let actual = dt({foo: {a: 'a'}}, {
        computed: {
          ['foo.b'](target, key, paths, ref) {
            expect(key).toBe('b');
            expect(paths).toEqual(['foo']);
            expect(target).toEqual({a: 'a'});
            return 'b';
          }
        }
      });

      expect(actual).toEqual({foo: {a: 'a', b: 'b'}});
    });

    it('compute new key `b` and `c` for array object', () => {
      let actual = dt(
        [{a: '1'}, {a: '2'}],
        {computed: {
          ['[].b']() {
            return 'b' + this.a;
          },
          ['[].c']() {
            return 'c';
          }
        }}
      );

      expect(actual).toEqual([{a: '1', b: 'b1', c: 'c'}, {a: '2', b: 'b2', c: 'c'}]);
    });

    it('will not compute key `a` for object aleady has it', () => {
      let actual = dt({a: 'a'}, {computed: {a() { return 'b'; }}});
      expect(actual).toEqual({a: 'a'});
    });
  });

  describe('map', () => {
    it('map a object to another', () => {
      let expected = {};
      let actual = dt({a: 'a'}, {map(target) { return expected; }});
      expect(actual).toBe(expected);
    });
  });

  // 主要在 naming.spec.ts 中测试
  describe('naming', () => {
    it('update object key to specified naming', () => {
      let actual = dt({areYou: 'ok'}, {naming: 'snake'});
      expect(actual).toEqual({'are_you': 'ok'});
    });
  });

  describe('all supported transforms', () => {
    it('deep clone a new object when config is null', () => {
      let data = {a: 'aa', b: {b1: 'bb1'}};
      let actual = dt(data);

      expect(actual).not.toBe(data);
      expect(actual.b).not.toBe(data.b);
      expect(actual).toEqual(data);
    });
  });

});
