import { calculateCostDiff } from '../../src/domain/opportunityCostCalculations'

describe("Opportunity Cost Calculation Tests", () => {
	test('Test Cost Diff returns non zero number when new is greater than previous', () => {
		expect(calculateCostDiff(10, 20)).toBe(10)
	});

	test('Test Cost Diff returns zero number when new is less than previous', () => {
		expect(calculateCostDiff(20, 10)).toBe(0)
	});
});
