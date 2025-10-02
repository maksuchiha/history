import { FC, memo, useMemo } from 'react';
import type { YearPair } from '@store/data';
import { useCircularController } from '@features/CircularPagination/hooks/useCircularController';
import { CircularView } from '@features/CircularPagination/modules/CircularView';
import { clampCount } from '@features/CircularPagination/utils/clampCount';
import { Years } from '@features/CircularPagination/modules/Years';
import { shallowArrayEqual } from '@features/CircularPagination/utils/shallowArrayEqual';
import { shallowYearsEqual } from '@features/CircularPagination/utils/shallowYearsEqual';
import { useStableCallback } from '@features/CircularPagination/hooks/useStableCallback';

type TitleItem = string | null | undefined;

type PropsType = {
	count: number;
	value: number;
	onChange: (i: number) => void;
	onPrev?: () => void;
	onNext?: () => void;
	radius?: number;
	dotSize?: number;
	durationMs?: number;
	titles?: ReadonlyArray<TitleItem>;
	fixedAngleDeg?: number;
	years?: ReadonlyArray<YearPair>;
};

const areEqualProps = (prev: Readonly<PropsType>, next: Readonly<PropsType>): boolean => {
	return (
		prev.count === next.count &&
		prev.value === next.value &&
		prev.radius === next.radius &&
		prev.dotSize === next.dotSize &&
		prev.durationMs === next.durationMs &&
		prev.fixedAngleDeg === next.fixedAngleDeg &&
		prev.onChange === next.onChange &&
		prev.onPrev === next.onPrev &&
		prev.onNext === next.onNext &&
		shallowArrayEqual(prev.titles, next.titles) &&
		shallowYearsEqual(prev.years, next.years)
	);
};

export const Circular: FC<PropsType> = memo((props) => {
	const { count, value, radius, dotSize, durationMs, fixedAngleDeg, onChange, onPrev, onNext, titles, years } = props;

	const r: number = radius ?? 110;
	const ds: number = dotSize ?? 40;
	const dur: number = durationMs ?? 420;
	const fixed: number = fixedAngleDeg ?? -45;

	const onChangeStable = useStableCallback(onChange)!; // onChange обязателен по пропсам
	const onPrevStable = useStableCallback(onPrev);
	const onNextStable = useStableCallback(onNext);

	const cappedCount = useMemo<number>(() => clampCount(count), [count]);
	const safeValue = useMemo<number>(() => ((value % cappedCount) + cappedCount) % cappedCount, [value, cappedCount]);

	const { stageRef, stageSize, anglesDeg, animating, goPrev, goNext, goTo, phiDeg } = useCircularController({
		count: cappedCount,
		value: safeValue,
		radius: r,
		dotSize: ds,
		durationMs: dur,
		fixedAngleDeg: fixed,
		onChange: onChangeStable,
		onPrev: onPrevStable,
		onNext: onNextStable,
	});

	const titlesSlice = useMemo<ReadonlyArray<TitleItem> | undefined>(
		() => (titles ? titles.slice(0, cappedCount) : undefined),
		[titles, cappedCount],
	);

	const { blue, pink } = useMemo<{ blue: number; pink: number }>(() => {
		if (!years?.length) return { blue: 0, pink: 0 };
		const idx = ((safeValue % years.length) + years.length) % years.length;
		const y = years[idx]!;
		return { blue: y.blue, pink: y.pink };
	}, [years, safeValue]);

	return (
		<>
			<CircularView
				stageRef={stageRef}
				radius={r}
				dotSize={ds}
				stageSize={stageSize}
				anglesDeg={anglesDeg}
				activeIndex={safeValue}
				animating={animating}
				titles={titlesSlice as (string | null | undefined)[] | undefined}
				onDotClick={goTo}
				onPrev={goPrev}
				onNext={goNext}
				phiDeg={phiDeg}
			/>
			<Years blue={blue} pink={pink} durationMs={dur} />
		</>
	);
}, areEqualProps);
