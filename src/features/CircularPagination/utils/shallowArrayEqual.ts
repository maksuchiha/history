export const shallowArrayEqual = <A>(a?: ReadonlyArray<A>, b?: ReadonlyArray<A>): boolean => {
	if (a === b) return true;
	if (!a || !b) return !a && !b;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};
