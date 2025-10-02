export const makeToken = (): string => {
	if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
		const arr = new Uint32Array(2);
		crypto.getRandomValues(arr);
		return Array.from(arr, (n) => n.toString(36)).join('');
	}
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
};
