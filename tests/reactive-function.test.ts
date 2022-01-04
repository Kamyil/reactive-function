import { onChange, reactive } from '../index';

interface TestObject {
  key: number;
}

describe('reactive-function', () => {
  it('should recompute primitive values', () => {
    const primitiveValue = reactive(() => 2);
    const primitiveToCompute = reactive(() => primitiveValue.value * 2);

    expect(primitiveToCompute.value).toBe(4);

    primitiveValue.value = 4;

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
    let Car = reactive(() => ({
      color: 'green',
      width: 200,
      height: 300,
      length: 300,
      positionX: 0,
      positionY: 0,
      propultion: 'front',
      weight: 500,
    }));

    Car.value = {
      ...Car.value,
      height: 50,
    };
    onChange(Car, ({ previousValue, newValue }) => {
      expect(previousValue).toStrictEqual(300);
      expect(newValue).toStrictEqual(50);
    });
  });
});
