import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(() =>
		typeof window === 'undefined' ? false : window.matchMedia(query).matches,
	);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const mql = window.matchMedia(query);
		const onChange = () => setMatches(mql.matches);
		onChange();
		mql.addEventListener?.('change', onChange);
		return () => mql.removeEventListener?.('change', onChange);
	}, [query]);

	return matches;
};
