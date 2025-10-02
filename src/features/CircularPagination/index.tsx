import { FC, memo, useCallback, useMemo, useState } from 'react';
import { Circular } from './modules/Circular';
import s from './CircularPagination.module.scss';
import { Slider } from './modules/Slider';
import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { easeOutCubic } from '@features/CircularPagination/utils/easeOutCubic';
import { clampCount } from '@features/CircularPagination/utils/clampCount';

export type EventsType = { title: number; info: string };
export type YearPair = { blue: number; pink: number };
export type ExtendedYearsType = {
	startYear: number;
	endYear: number;
	events: EventsType[];
};

const fadeTransition: Transition = { duration: 0.57, ease: easeOutCubic };

type Props = {
	title: string;
	titles?: (string | null)[];
	blocks: ExtendedYearsType[];
};

export const CircularPagination: FC<Props> = memo(({ title, titles, blocks }) => {
	const [active, setActive] = useState(0);

	const count = blocks.length;
	const cappedCount = clampCount(count);
	const safeActive = ((active % Math.max(1, cappedCount)) + Math.max(1, cappedCount)) % Math.max(1, cappedCount);

	const years = useMemo<YearPair[]>(() => blocks.map((b) => ({ blue: b.startYear, pink: b.endYear })), [blocks]);

	const events = blocks[safeActive]?.events ?? [];

	const onPrev = useCallback(() => {
		setActive((a) => (a - 1 + cappedCount) % cappedCount);
	}, [cappedCount]);

	const onNext = useCallback(() => {
		setActive((a) => (a + 1) % cappedCount);
	}, [cappedCount]);

	const onChange = useCallback(
		(i: number) => {
			const safe = ((i % cappedCount) + cappedCount) % cappedCount;
			setActive(safe);
		},
		[cappedCount],
	);

	return (
		<div className={s.History}>
			<div className={s.Wrapper}>
				<h1 className={s.Title}>
					{title.split(' ').map((word, i, arr) => (
						<span key={i}>
							{word}
							{i < arr.length - 1 && <br />}
						</span>
					))}
				</h1>

				<Circular
					count={cappedCount}
					value={safeActive}
					onChange={onChange}
					onPrev={onPrev}
					onNext={onNext}
					radius={268}
					dotSize={60}
					durationMs={520}
					titles={titles?.slice(0, cappedCount)}
					fixedAngleDeg={-60}
					years={years.slice(0, cappedCount)}
				/>
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={safeActive}
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={fadeTransition}
				>
					<Slider events={events} />
				</motion.div>
			</AnimatePresence>
		</div>
	);
});
