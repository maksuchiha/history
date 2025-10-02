import { FC, CSSProperties, useCallback, useMemo, memo, RefObject } from 'react';
import s from './CircularView.module.scss';
import { Dot } from '@features/CircularPagination/modules/Dot';
import { Controls } from '@features/CircularPagination/modules/Controls';
import { useMediaQuery } from '@hooks/useMediaQuery';

type CircularViewProps = {
	stageRef: RefObject<HTMLDivElement>;
	radius: number;
	dotSize: number;
	stageSize: number;
	anglesDeg: number[];
	activeIndex: number;
	animating: boolean;
	titles?: (string | null | undefined)[];
	onDotClick: (i: number) => void;
	onPrev: () => void;
	onNext: () => void;
	phiDeg: number;
};

export const CircularView: FC<CircularViewProps> = memo(
	({
		stageRef,
		radius,
		dotSize,
		stageSize,
		anglesDeg,
		activeIndex,
		animating,
		titles,
		onDotClick,
		onPrev,
		onNext,
		phiDeg,
	}) => {
		const isTablet = useMediaQuery('(max-width: 767.9px)');

		const stageStyle = useMemo<CSSProperties>(
			() => ({
				width: stageSize,
				height: stageSize,
				['--phi']: `${phiDeg}deg`,
			}),
			[stageSize, phiDeg],
		);

		type RingStyle = CSSProperties & Record<'--ring', string>;

		const ringStyle = useMemo<RingStyle>(
			() => ({
				width: radius * 2,
				height: radius * 2,
				'--ring': '1px',
			}),
			[radius],
		);

		const handleDotClick = useCallback(
			(index: number) => {
				onDotClick(index);
			},
			[onDotClick],
		);

		return (
			<div className={s.Circular} role="group" aria-label="Кольцевая навигация">
				{!isTablet && (
					<div ref={stageRef} className={s.Stage} style={stageStyle} tabIndex={0} aria-roledescription="Кольцо">
						<div className={s.Ring} style={ringStyle} />
						{anglesDeg.map((angle, i) => (
							<Dot
								key={i}
								index={i}
								angleDeg={angle}
								active={i === activeIndex}
								onClick={handleDotClick}
								radius={radius}
								size={dotSize}
								durationMs={0}
								title={titles?.[i] ?? undefined}
								animating={animating}
							/>
						))}
					</div>
				)}
				<Controls goPrev={onPrev} goNext={onNext} index={activeIndex} total={anglesDeg.length} />
			</div>
		);
	},
);
