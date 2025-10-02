import s from './Controls.module.scss';
import { FC } from 'react';
import { Icon } from '@components/ui/Icon';

type PropsType = {
	goPrev: () => void;
	goNext: () => void;
	index: number;
	total: number;
};

const fmt2 = (n: number) => String(n).padStart(2, '0');

export const Controls: FC<PropsType> = ({ goPrev, goNext, index, total }) => {
	return (
		<div className={s.Controls}>
			<div className={s.Counter}>
				{fmt2(index + 1)} / {fmt2(total)}
			</div>
			<div className={s.Buttons}>
				<button type="button" onClick={goPrev} className={s.Arrow} aria-label="Влево">
					<Icon iconName={'arrow-left'} />
				</button>
				<button type="button" onClick={goNext} className={s.Arrow} aria-label="Вправо">
					<Icon iconName={'arrow-right'} />
				</button>
			</div>
		</div>
	);
};
