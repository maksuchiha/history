import { FC, memo, useMemo } from 'react';
import { YearPair } from '@store/data';
import { useCircularController } from '@features/CircularPagination/hooks/useCircularController';
import { CircularView } from '@features/CircularPagination/modules/CircularView';
import { clampCount } from '@features/CircularPagination/utils/clampCount';
import { Years } from '@features/CircularPagination/modules/Years';

type Props = {
	count: number;
	value: number;
	onChange: (i: number) => void;
	onPrev?: () => void;
	onNext?: () => void;
	radius?: number;
	dotSize?: number;
	durationMs?: number;
	titles?: (string | null | undefined)[];
	fixedAngleDeg?: number;
	years?: YearPair[];
};

export const Circular: FC<Props> = memo((props) => {
	const cappedCount = clampCount(props.count);
	const safeValue = ((props.value % cappedCount) + cappedCount) % cappedCount;

	const { stageRef, stageSize, anglesDeg, animating, goPrev, goNext, goTo, phiDeg } = useCircularController({
		count: cappedCount,
		value: safeValue,
		radius: props.radius ?? 110,
		dotSize: props.dotSize ?? 40,
		durationMs: props.durationMs ?? 420,
		fixedAngleDeg: props.fixedAngleDeg ?? -45,
		onChange: props.onChange,
		onPrev: props.onPrev,
		onNext: props.onNext,
	});

	const currentYears = useMemo(() => {
		const list = props.years ?? [];
		if (!list.length) return { blue: 0, pink: 0 };
		return list[((safeValue % list.length) + list.length) % list.length];
	}, [props.years, safeValue]);

	return (
		<>
			<CircularView
				stageRef={stageRef}
				radius={props.radius ?? 110}
				dotSize={props.dotSize ?? 40}
				stageSize={stageSize}
				anglesDeg={anglesDeg}
				activeIndex={safeValue}
				animating={animating}
				titles={props.titles?.slice(0, cappedCount)}
				onDotClick={goTo}
				onPrev={goPrev}
				onNext={goNext}
				phiDeg={phiDeg}
			/>
			<Years blue={currentYears.blue} pink={currentYears.pink} durationMs={props.durationMs ?? 420} />
		</>
	);
});
