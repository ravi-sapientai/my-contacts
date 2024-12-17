// @flow

import { describe, it, expect } from '@jest/globals';
import type { $DeepShape } from '../../../src/providers/types';

describe('$DeepShape type', () => {
  it('should allow partial shape of an object', () => {
    type TestObject = {
      a: number,
      b: string,
      c: {
        d: boolean,
        e: Array<string>
      }
    };

    type PartialTestObject = $DeepShape<TestObject>;

    const partialObj: PartialTestObject = {
      a: 1,
      c: {
        e: ['test']
      }
    };

    // This is a type-level test, so we're just checking if it compiles
    expect(partialObj).toBeDefined();
  });

  it('should allow nested partial shapes', () => {
    type NestedObject = {
      x: {
        y: {
          z: number
        }
      }
    };

    type PartialNestedObject = $DeepShape<NestedObject>;

    const partialNested: PartialNestedObject = {
      x: {
        y: {}
      }
    };

    // This is a type-level test, so we're just checking if it compiles
    expect(partialNested).toBeDefined();
  });

  it('should not allow extra properties', () => {
    type SimpleObject = {
      foo: string
    };

    type PartialSimpleObject = $DeepShape<SimpleObject>;

    // @flow-expect-error
    const invalidObject: PartialSimpleObject = {
      bar: 'extra property'
    };

    // This should not compile, but we add an expect to satisfy Jest
    expect(invalidObject).toBeDefined();
  });
});