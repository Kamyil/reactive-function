import { reactive } from '../src/index';

describe('excel-test: probably best example to show effectivness of this mini-library', () => {
  const INITIAL_SPREADSHEET_STATE = {
    a: {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
    },
    b: {
      1: 2,
      2: 4,
      3: 6,
      4: 8,
      5: 10,
    },
  };

  let Cells = INITIAL_SPREADSHEET_STATE;

  function makeSureSpreadsheetIsClean() {
    Cells = INITIAL_SPREADSHEET_STATE;
  }

  beforeEach(makeSureSpreadsheetIsClean);

  it('should use lots and lots of dependencies and react to them accordingally', () => {
    let reactiveCells = reactive(Cells);
    let c1 = reactive(
      () =>
        reactiveCells.value.a[5] * reactiveCells.value.b[5] +
        reactiveCells.value.a[2] +
        reactiveCells.value.b[2]
    );

    expect(c1.value).toBe(56);

    reactiveCells.value = {
      ...reactiveCells.value,
      b: {
        ...reactiveCells.value.b,
        5: 20,
      },
    };

    expect(c1.value).toBe(106);
  });
});
