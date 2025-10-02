import { useEffect, useRef, useState } from 'react';
import s from './Years.module.scss';
import { easeInOutCubic } from '@features/CircularPagination/utils/easeInOutCubic';

const useAnimatedNumber = (target: number, durationMs: number) => {
	const [display, setDisplay] = useState<number>(target);
	const rafRef = useRef<number | null>(null);
	const fromRef = useRef<number>(target);
	const toRef = useRef<number>(target);

	useEffect(() => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);

		const start = performance.now();
		fromRef.current = display;
		toRef.current = target;

		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / Math.max(1, durationMs));
			const k = easeInOutCubic(t);
			const val = fromRef.current + (toRef.current - fromRef.current) * k;
			setDisplay(val);
			if (t < 1) {
				rafRef.current = requestAnimationFrame(tick);
			} else {
				rafRef.current = null;
				setDisplay(target);
			}
		};

		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [target, durationMs]);

	return Math.round(display);
}

type YearsProps = {
	blue: number;
	pink: number;
	durationMs?: number;
};

export const Years = ({ blue, pink, durationMs = 420 }: YearsProps) => {
	const blueAnimated = useAnimatedNumber(blue, durationMs);
	const pinkAnimated = useAnimatedNumber(pink, durationMs);

	return (
		<div className={s.Years}>
			<div className={`${s.Year} ${s.Year_blue}`}>{blueAnimated}</div>
			<div className={`${s.Year} ${s.Year_pink}`}>{pinkAnimated}</div>
		</div>
	);
};
