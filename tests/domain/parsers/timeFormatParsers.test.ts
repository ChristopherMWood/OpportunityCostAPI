import { getSecondsFromISO8601 } from '../../../src/domain/parsers/timeFormatParsers'

describe("ISO8601 Parser Tests", () => {
	test('Converts Minutes and Seconds to Seconds', () => {
		const seconds = getSecondsFromISO8601("PT4M13S")

		expect(seconds).toBe((60 * 4) + 13)
	});

	test('Converts Day and Hours to Seconds', () => {
		const seconds = getSecondsFromISO8601("P1DT12H")

		expect(seconds).toBe((36 * 60 * 60))
	});
});
