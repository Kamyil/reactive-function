import { reactive, trackChanges, stopTracking, syncWithHTML } from '../index';

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
    const object = reactive<TestObject>({
      key: 1,
    });

    const primitive = reactive(() => object.value.key * 2);
    expect(primitive.value).toBe(2);

    object.value = { key: 2 };
    expect(primitive.value).toBe(4);

    object.value = { key: 4 };
    expect(primitive.value).toBe(8);
  });

  it('should properly perform callback used in trackChanges function on value change and test if previous and new values are correct', () => {
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

  it('should allow to stop watching current trackChanges instance', () => {
    const testNumber1 = reactive(1);
    const doubled = reactive(() => testNumber1.value * 2);

    const count = jest.fn();
    trackChanges(testNumber1, ({ newValue }) => {
      if (newValue > 5) stopTracking(testNumber1);
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

    expect(doubled.value).toBe(20);
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

  it('should keep track on reactive value that was computed from other reactive value', () => {
    const firstNumber = reactive(2);
    const double = reactive(() => firstNumber.value * 2);

    trackChanges(double, ({ previousValue, newValue }) => {
      expect(previousValue).toBe(4);
      expect(newValue).toBe(8);
    });

    firstNumber.value = 4;
    expect(double.value).toBe(8);
  });

  it('should allow to sync reactive value with HTML and perform optional callback after that', () => {
    const elementToSync = document.createElement('div');
    const myNumber = reactive(1);
    const doubledNumber = reactive(() => myNumber.value * 2);

    syncWithHTML(doubledNumber, elementToSync, {
      callback: ({ previousValue, newValue }) => {
        expect(previousValue).toBe(2);
        if (elementToSync.style.background !== 'red') {
          elementToSync.style.background = 'red';
        }
        expect(newValue).toBe(4);
        expect(elementToSync.textContent).toBe('4');
        expect(elementToSync.style.background).toBe('red');
      },
    });
    myNumber.value = 2;

    expect(doubledNumber.value).toBe(4);
  });

  it('should also work with passing a simple selector instead of element', () => {
    const elementToSync = document.createElement('div');
    elementToSync.classList.add('element-to-sync');
    const myNumber = reactive(1);
    const doubledNumber = reactive(() => myNumber.value * 2);

    syncWithHTML(doubledNumber, '.element-to-sync', {
      callback: ({ previousValue, newValue }) => {
        expect(previousValue).toBe(2);
        if (elementToSync.style.background !== 'red') {
          elementToSync.style.background = 'red';
        }
        expect(newValue).toBe(4);
        expect(elementToSync.textContent).toBe('4');
        expect(elementToSync.style.background).toBe('red');
      },
    });
    myNumber.value = 2;

    expect(doubledNumber.value).toBe(4);
  });
});
