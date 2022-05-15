import { ParsingHelpers } from '../src/parsingHelpers.js';

test('Seconds are correctly parsed to time object', () => {
  const time = ParsingHelpers.getTimeFromTotalSeconds(30);
  expect(time.seconds).toBe(30);
});