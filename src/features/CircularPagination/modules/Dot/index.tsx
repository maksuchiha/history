import { CSSProperties, FC, memo, useCallback, useMemo } from 'react';
import s from './Dot.module.scss';

type PropsType = {
	index: number;
	angleDeg: number;
	active: boolean;
	onClick: (index: number) => void;
	radius: number;
	size: number;
	durationMs: number;
	title?: string;
	animating?: boolean;
};

const GAP = 12;
const BORDER = 2;

export const Dot: FC<PropsType> = memo(
	({ index, angleDeg, active, onClick, radius, size, durationMs, title, animating }) => {
		const vars = useMemo(
			() =>
				({
					'--angle': `${angleDeg}deg`,
					'--radius': `${radius}px`,
					'--size': `${size}px`,
					'--dur': `${durationMs}ms`,
					'--title-offset': `${size / 2 + BORDER + GAP}px`,
				}) as CSSProperties,
			[angleDeg, radius, size, durationMs],
		);

		const ariaLabel = title ? `К точке ${index + 1}: ${title}` : `К точке ${index + 1}`;
		const titleId = active && title ? `dot-title-${index}` : undefined;

		const handleClick = useCallback(() => onClick(index), [onClick, index]);

		return (
			<div className={s.DotWrap} style={vars} data-animating={animating ? 'true' : undefined} data-index={index}>
				<button
					type="button"
					onClick={handleClick}
					aria-current={active || undefined}
					aria-label={ariaLabel}
					aria-describedby={titleId}
					data-active={active || undefined}
					className={s.Dot}
					title={title}
				>
					<span className={s.Bubble} />
					<span className={s.Label}>{index + 1}</span>

					{active && title && (
						<span id={titleId} className={s.DotTitle}>
							<span>{title}</span>
						</span>
					)}
				</button>
			</div>
		);
	},
);
