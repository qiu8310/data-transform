import {
  transformers,
  naming
} from './naming';

let {camel, kebab, snake, upper, capCamel} = transformers;

describe('naming', () => {
  describe('transformers', () => {
    it('transform string to camel format', () => {
      expect(camel('are you')).toBe('areYou');
    });

    it('transform string to kebab format', () => {
      expect(kebab('areYou')).toBe('are-you');
    });

    it('transform string to snake format', () => {
      expect(snake('Are You')).toBe('are_you');
    });

    it('transform string to capCamel format', () => {
      expect(capCamel('are-you')).toBe('AreYou');
    });

    it('transform string to upper format', () => {
      expect(upper('are  you')).toBe('ARE_YOU');
    });
  });
  describe('naming', () => {
    it('do nothing when transform not exists', () => {
      expect(naming('are  you')).toBe('are  you');
      expect(naming('are  you', 'foo')).toBe('are  you');
    });

    it('should transform string to specified format', () => {
      expect(naming('aB', 'upper')).toBe('A_B');
    });

    it('should chain transforms', () => {
      expect(naming('aB', ['upper', 'kebab'])).toBe('a-b');
    });
  });
});
