import { FC, CSSProperties, useMemo, memo, RefObject, useId } from 'react';
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
	ariaGroupLabel?: string;
	ariaRingDescription?: string;
};

type CSSVars = CSSProperties & {
	['--phi']?: string;
	['--ring']?: string;
};

export const CircularView: FC<CircularViewProps> = memo((props) => {
	const {
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
		ariaGroupLabel = 'Круговая пагинация',
		ariaRingDescription = 'Круг',
	} = props;

	const isTablet = useMediaQuery('(max-width: 991.9px)');
	const stageId = useId();
	const stageStyle = useMemo<CSSVars>(
		() => ({
			width: stageSize,
			height: stageSize,
			['--phi']: `${phiDeg}deg`,
		}),
		[stageSize, phiDeg],
	);
	const ringStyle = useMemo<CSSVars>(
		() => ({
			width: radius * 2,
			height: radius * 2,
			['--ring']: '1px',
		}),
		[radius],
	);

	const total = anglesDeg.length;

	return (
		<div className={s.Circular} role="group" aria-label={ariaGroupLabel}>
			{!isTablet && (
				<div
					id={stageId}
					ref={stageRef}
					className={s.Stage}
					style={stageStyle}
					aria-roledescription={ariaRingDescription}
					aria-label={ariaRingDescription}
				>
					<div className={s.Ring} style={ringStyle} />
					{anglesDeg.map((angle, i) => (
						<Dot
							key={i}
							index={i}
							angleDeg={angle}
							active={i === activeIndex}
							onClick={onDotClick}
							radius={radius}
							size={dotSize}
							durationMs={0}
							title={titles?.[i] ?? undefined}
							animating={animating}
						/>
					))}
				</div>
			)}

			<Controls
				goPrev={onPrev}
				goNext={onNext}
				index={activeIndex}
				total={total}
				ariaPrevLabel="Влево"
				ariaNextLabel="Вправо"
				ariaControlsId={stageId}
				disabled={animating}
			/>
		</div>
	);
});
