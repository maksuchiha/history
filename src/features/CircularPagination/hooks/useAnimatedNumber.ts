import { useEffect, useRef, useState } from 'react';
import { easeInOutCubic } from '@features/CircularPagination/utils/easeInOutCubic';

const isFiniteNumber = (n: number) => Number.isFinite(n);

export const useAnimatedNumber = (target: number, durationMs: number = 420) => {
	const safeTarget = isFiniteNumber(target) ? target : 0;

	const [display, setDisplay] = useState<number>(safeTarget);

	const rafRef = useRef<number | null>(null);
	const fromRef = useRef<number>(safeTarget);
	const toRef = useRef<number>(safeTarget);

	useEffect(() => {
		const media = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : null;
		const reduceMotion = media?.matches ?? false;

		if (durationMs <= 0 || reduceMotion) {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			fromRef.current = safeTarget;
			toRef.current = safeTarget;
			setDisplay(safeTarget);
			return;
		}

		if (rafRef.current) cancelAnimationFrame(rafRef.current);

		const start = performance.now();
		fromRef.current = display; // текущее визуальное значение — точка старта
		toRef.current = safeTarget;

		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / durationMs);
			const k = easeInOutCubic(t);
			const val = fromRef.current + (toRef.current - fromRef.current) * k;
			setDisplay(val);

			if (t < 1) {
				rafRef.current = requestAnimationFrame(tick);
			} else {
				rafRef.current = null;
				setDisplay(safeTarget); // финальное выравнивание
			}
		};

		rafRef.current = requestAnimationFrame(tick);

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [safeTarget, durationMs]);

	return Math.round(display);
};
