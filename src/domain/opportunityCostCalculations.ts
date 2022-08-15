export function calculateCostDiff(previousOpportunityCost: number, newOpportunityCost: number) {
	const diff = newOpportunityCost - previousOpportunityCost
	return diff > 0 ? diff : 0;
}