import type { YearPair } from '@store/data';

export const shallowYearsEqual = (a?: ReadonlyArray<YearPair>, b?: ReadonlyArray<YearPair>): boolean => {
	if (a === b) return true;
	if (!a || !b) return !a && !b;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		const ai = a[i];
		const bi = b[i];
		if (ai.blue !== bi.blue || ai.pink !== bi.pink) return false;
	}
	return true;
};
