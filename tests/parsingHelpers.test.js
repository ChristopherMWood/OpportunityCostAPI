import { ParsingHelpers } from '../src//api/opportunityCostApi/parsingHelpers';

test('Seconds are correctly parsed to time object', () => {
  const time = ParsingHelpers.getTimeFromTotalSeconds(30);
  expect(time.seconds).toBe(30);
});