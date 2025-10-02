import { FC, memo } from 'react';
import s from './Years.module.scss';
import { useAnimatedNumber } from '@features/CircularPagination/hooks/useAnimatedNumber';

type YearsProps = {
	blue: number;
	pink: number;
	durationMs?: number;
};

export const Years: FC<YearsProps> = memo(({ blue, pink, durationMs = 420 }) => {
	const blueAnimated = useAnimatedNumber(blue, durationMs);
	const pinkAnimated = useAnimatedNumber(pink, durationMs);

	return (
		<div className={s.Years} role="group">
			<div className={`${s.Year} ${s.Year_blue}`} aria-label={`Синие: ${blueAnimated}`}>
				{blueAnimated}
			</div>
			<div className={`${s.Year} ${s.Year_pink}`} aria-label={`Розовые: ${pinkAnimated}`}>
				{pinkAnimated}
			</div>
		</div>
	);
});
