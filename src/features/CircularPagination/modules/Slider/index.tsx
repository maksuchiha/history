import { FC, useCallback, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import s from './Slider.module.scss';
import { Icon } from '@components/ui/Icon';
import { EventsType } from '@store/data';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { createSwiperSelectors } from '@features/CircularPagination/utils/swiperSelectors';
import { useSwiperTail } from '@features/CircularPagination/hooks/useSwiperTail';
import { useSwiperSnapToEnd } from '@features/CircularPagination/hooks/useSwiperSnapToEnd';

type PropsType = {
	events: EventsType[];
	prevAriaLabel?: string;
	nextAriaLabel?: string;
};

const MOBILE_MAX = 992; // <=992px — мобильная версия

export const Slider: FC<PropsType> = ({ events, prevAriaLabel = 'Previous', nextAriaLabel = 'Next' }) => {
	const isMobile = useMediaQuery(`(max-width:${MOBILE_MAX}px)`);
	const { prevCls, nextCls, pagCls } = useMemo(() => createSwiperSelectors('js-swiper'), []);
	const ensureLastCanBeActive = useSwiperTail(isMobile);
	const handleTouchEnd = useSwiperSnapToEnd(isMobile, 350);

	const swiperRef = useRef<SwiperClass | null>(null);

	const handleSwiper = useCallback((inst: SwiperClass) => {
		swiperRef.current = inst;
	}, []);

	const handleInit = useCallback(
		(inst: SwiperClass) => {
			ensureLastCanBeActive(inst);
		},
		[ensureLastCanBeActive],
	);

	const handleResize = useCallback(
		(inst: SwiperClass) => {
			ensureLastCanBeActive(inst);
		},
		[ensureLastCanBeActive],
	);

	return (
		<div className={s.Slider}>
			<button className={`${s.Arrow} ${s.Arrow_prev} ${prevCls}`} aria-label={prevAriaLabel}>
				<Icon iconName="arrow-left" />
			</button>
			<button className={`${s.Arrow} ${s.Arrow_next} ${nextCls}`} aria-label={nextAriaLabel}>
				<Icon iconName="arrow-right" />
			</button>

			<Swiper
				modules={[Navigation, Pagination]}
				className={s.SwiperName}
				slidesPerView="auto"
				loop={false}
				simulateTouch
				grabCursor
				threshold={5}
				touchAngle={45}
				longSwipesRatio={0.5}
				longSwipesMs={120}
				resistanceRatio={0.75}
				speed={350}
				roundLengths
				onSwiper={handleSwiper}
				onInit={handleInit}
				onResize={handleResize}
				onTouchEnd={handleTouchEnd}
				navigation={{ enabled: true, prevEl: `.${prevCls}`, nextEl: `.${nextCls}` }}
				pagination={{ el: `.${pagCls}`, clickable: true }}
				breakpoints={{
					0: { pagination: { enabled: true } },
					993: { pagination: { enabled: false } },
				}}
			>
				{events.map((event, i) => (
					<SwiperSlide key={i} className={s.SwiperSlide}>
						<div className={s.Slide}>
							<div className={s.Slide__title}>{event.title}</div>
							<p className={s.Slide__info}>{event.info}</p>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			<div className={`swiper-pagination ${s.Pagination} ${pagCls}`} />
		</div>
	);
};
