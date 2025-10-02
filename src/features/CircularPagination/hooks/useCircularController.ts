import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { shortestAngleDelta } from './../utils/shortestAngleDelta';
import { easeInOutSine } from '@features/CircularPagination/utils/easeInOutSine';

type Args = {
	count: number;
	value: number;
	fixedAngleDeg: number;
	durationMs: number;
	radius: number;
	dotSize: number;
	onChange: (i: number) => void;
	onPrev?: () => void;
	onNext?: () => void;
};

const wrapIndex = (i: number, count: number) => ((i % count) + count) % count;

const baseAngleOfIndex = (i: number, n: number) => (360 / Math.max(1, n)) * i;

const targetPhiForIndex = (i: number, n: number, fixedAngleDeg: number) => fixedAngleDeg - baseAngleOfIndex(i, n);

export function useCircularController({
	count,
	value,
	fixedAngleDeg,
	durationMs,
	radius,
	dotSize,
	onChange,
	onPrev,
	onNext,
}: Args) {
	const stageSize = useMemo(() => Math.round((radius + dotSize / 2) * 2), [radius, dotSize]);

	const anglesDeg = useMemo(() => {
		if (count <= 0) return [] as number[];
		const arr = new Array<number>(count);
		for (let i = 0; i < count; i++) arr[i] = baseAngleOfIndex(i, count);
		return arr;
	}, [count]);

	const stageRef = useRef<HTMLDivElement | null>(null);

	const phiRef = useRef<number>(targetPhiForIndex(value, count, fixedAngleDeg));

	useLayoutEffect(() => {
		const el = stageRef.current;
		if (el) el.style.setProperty('--phi', `${phiRef.current}deg`);
	}, []);

	const rafRef = useRef<number | null>(null);
	const startTimeRef = useRef<number | null>(null);
	const fromRef = useRef<number>(phiRef.current);
	const toRef = useRef<number>(phiRef.current);

	const [animating, setAnimating] = useState(false);

	const applyRotate = useCallback((deg: number) => {
		const el = stageRef.current;
		if (!el) return;
		el.style.setProperty('--phi', `${deg}deg`);
	}, []);

	useLayoutEffect(() => {
		const target = targetPhiForIndex(value, count, fixedAngleDeg);

		const from = phiRef.current;
		const delta = shortestAngleDelta(from, target);
		const to = from + delta;

		if (rafRef.current != null) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		startTimeRef.current = null;
		fromRef.current = from;
		toRef.current = to;

		if (durationMs <= 0 || Math.abs(delta) < 1e-4) {
			phiRef.current = target;
			applyRotate(target);
			setAnimating(false);
			return;
		}

		setAnimating(true);

		const step = (ts: number) => {
			if (startTimeRef.current == null) startTimeRef.current = ts;
			const t = Math.min(1, (ts - startTimeRef.current) / durationMs);
			const eased = easeInOutSine(t);
			const current = fromRef.current + (toRef.current - fromRef.current) * eased;

			phiRef.current = current;
			applyRotate(current);

			if (t < 1) {
				rafRef.current = requestAnimationFrame(step);
			} else {
				phiRef.current = target;
				applyRotate(target);
				rafRef.current = null;
				startTimeRef.current = null;
				setAnimating(false);
			}
		};

		rafRef.current = requestAnimationFrame(step);

		return () => {
			if (rafRef.current != null) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, [value, count, fixedAngleDeg, durationMs, applyRotate]);

	const goTo = useCallback(
		(i: number) => {
			if (count <= 0) return;
			const safeIndex = wrapIndex(i, count);
			if (safeIndex === value) return;
			onChange(safeIndex);
		},
		[count, value, onChange],
	);

	const goPrev = useCallback(() => {
		if (count <= 0) return;
		const prev = wrapIndex(value - 1, count);
		onPrev?.();
		onChange(prev);
	}, [count, value, onPrev, onChange]);

	const goNext = useCallback(() => {
		if (count <= 0) return;
		const next = wrapIndex(value + 1, count);
		onNext?.();
		onChange(next);
	}, [count, value, onNext, onChange]);

	useEffect(() => {
		return () => {
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	return {
		stageRef,
		stageSize,
		anglesDeg,
		animating,
		goTo,
		goPrev,
		goNext,
		phiDeg: phiRef.current,
	};
}
