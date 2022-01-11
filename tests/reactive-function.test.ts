import { trackChanges, reactive, destructure } from '../index';

interface TestObject {
  key: number;
}

describe('reactive-function', () => {
  it('should be able to handle passed primitive values in both ways', () => {
    const primitiveValueAsFunction = reactive(() => 2);
    const primitiveToCompute = reactive(
      () => primitiveValueAsFunction.value * 2
    );
    const passedPrimitive = reactive(2);
    const passedPrimitiveToCompute = reactive(() => passedPrimitive.value * 2);

    passedPrimitive.value = 4;

    expect(primitiveToCompute.value).toBe(4);
    expect(passedPrimitiveToCompute.value).toBe(8);

    primitiveValueAsFunction.value = 4;

    expect(primitiveToCompute.value).toBe(8);
  });

  it('should recompute object properties', () => {
    const object = reactive<TestObject>(() => ({
      key: 1,
    }));

    const primitive = reactive(() => object.value.key * 2);
    expect(primitive.value).toBe(2);

    object.value = { key: 2 };
    expect(primitive.value).toBe(4);

    object.value = { key: 4 };
    expect(primitive.value).toBe(8);
  });

  it('should properly perform callback used in onChange function on value change and test if previous and new values are correct', () => {
    let Car = reactive({
      color: 'green',
      width: 200,
      height: 300,
      length: 300,
      positionX: 0,
      positionY: 0,
      propultion: 'front',
      weight: 500,
    });

    Car.value = {
      ...Car.value,
      height: 50,
    };
    trackChanges(Car, ({ previousValue, newValue }) => {
      expect(previousValue).toStrictEqual(300);
      expect(newValue).toStrictEqual(50);
    });
  });

  it('should work properly with arrays', () => {
    const testArray = reactive(() => [1, 2, 3]);
    trackChanges(testArray, ({ newValue }) => {
      expect(newValue).toBe(4);
    });
    testArray.value.push(4);

    const testArray2 = reactive(() => [1, 2, 3]);
    trackChanges(testArray2, ({ newValue }) => {
      expect(newValue).toStrictEqual([1, 2, 3, 4]);
    });
    testArray2.value = [1, 2, 3, 4];

    expect(testArray2.value).toStrictEqual([1, 2, 3, 4]);
  });

  it('should allow to stop watching current onChange instance', () => {
    const testNumber1 = reactive(1);

    const count = jest.fn();
    const { stopTracking } = trackChanges(testNumber1, ({ newValue }) => {
      if (newValue > 5) stopTracking();
      else count();
    });

    testNumber1.value = 2;
    testNumber1.value = 3;
    testNumber1.value = 4;
    testNumber1.value = 5;
    testNumber1.value = 6;
    testNumber1.value = 7;
    testNumber1.value = 8;
    testNumber1.value = 9;
    testNumber1.value = 10;

    expect(testNumber1.value).toBe(10);
    expect(count).toBeCalledTimes(4);
  });

  it('should allow to pass simple primitive value and still expect it to be reactive', () => {
    const testNumber = reactive(1);
    const testArray = reactive([1, 2, 3]);
    trackChanges(testNumber, ({ newValue }) => {
      expect(newValue).toBe(2);
    });
    trackChanges(testArray, ({ newValue }) => {
      expect(newValue).toStrictEqual([1, 2, 3, 4]);
    });

    testNumber.value = 2;
    testArray.value = [...testArray.value, 4];
  });

  it('should allow to destructure properties and make them reactive', () => {
    interface ITestObject {
      foo: string;
      bar: string;
      baz: string;
    }

    const testObject = reactive<ITestObject>({
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    });

    const { foo, bar } = destructure(testObject);

    console.log(foo);
    /**
     * It has to work this way
     *
     */

    testObject.value = {
      foo: 'FOO',
      bar: 'BAR',
      ...testObject.value,
    };

    expect(foo).toBe('FOO');
    expect(bar).toBe('BAR');
    expect(testObject.value.baz).toBe('baz');
  });
});
