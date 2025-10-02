import { useCallback, useEffect, useRef } from 'react';

export const useStableCallback = <T extends (...args: never[]) => unknown>(fn?: T) => {
	const ref = useRef<T | undefined>(fn);

	useEffect(() => {
		ref.current = fn;
	}, [fn]);

	return useCallback((...args: Parameters<NonNullable<T>>): ReturnType<NonNullable<T>> => {
		// @ts-expect-error — TS не всегда понимает, что ref.current тут точно T
		return ref.current?.(...args);
	}, []) as T | undefined;
};
