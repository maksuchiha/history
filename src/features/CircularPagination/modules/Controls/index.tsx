import { FC, memo, useCallback } from 'react';
import s from './Controls.module.scss';
import { Icon } from '@components/ui/Icon';

type PropsType = {
	goPrev: () => void;
	goNext: () => void;
	index: number;
	total: number;
	ariaPrevLabel?: string;
	ariaNextLabel?: string;
	ariaControlsId?: string;
	disabled?: boolean;
};

const fmt2 = (n: number) => String(n).padStart(2, '0');

export const Controls: FC<PropsType> = memo(
	({
		goPrev,
		goNext,
		index,
		total,
		ariaPrevLabel = 'Назад',
		ariaNextLabel = 'Вперёд',
		ariaControlsId,
		disabled = false,
	}) => {
		const handlePrev = useCallback(() => {
			if (!disabled) goPrev();
		}, [goPrev, disabled]);

		const handleNext = useCallback(() => {
			if (!disabled) goNext();
		}, [goNext, disabled]);

		return (
			<div className={s.Controls}>
				<div className={s.Counter} aria-live="polite" aria-atomic="true" role="status">
					{fmt2(index + 1)} / {fmt2(total)}
				</div>

				<div className={s.Buttons}>
					<button
						type="button"
						onClick={handlePrev}
						className={s.Arrow}
						aria-label={ariaPrevLabel}
						aria-controls={ariaControlsId}
						disabled={disabled}
					>
						<Icon iconName="arrow-left" />
					</button>

					<button
						type="button"
						onClick={handleNext}
						className={s.Arrow}
						aria-label={ariaNextLabel}
						aria-controls={ariaControlsId}
						disabled={disabled}
					>
						<Icon iconName="arrow-right" />
					</button>
				</div>
			</div>
		);
	},
);
