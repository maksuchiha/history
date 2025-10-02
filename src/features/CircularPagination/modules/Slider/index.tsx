import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import s from './Slider.module.scss';
import { FC, useRef } from 'react';
import { Icon } from '@components/ui/Icon';
import 'swiper/css';
import 'swiper/css/pagination';
import { EventsType } from '@store/data';

type PropsType = {
	events: EventsType[];
};

export const Slider: FC<PropsType> = ({ events }) => {
	const prevRef = useRef<HTMLButtonElement | null>(null);
	const nextRef = useRef<HTMLButtonElement | null>(null);

	const getSlides = events.map((event, index) => {
		return (
			<SwiperSlide key={index} className={s.SwiperSlide}>
				<div className={s.Slide}>
					<div className={s.Slide__title}>{event.title}</div>
					<p className={s.Slide__info}>{event.info}</p>
				</div>
			</SwiperSlide>
		);
	});

	return (
		<div className={s.Slider}>
			<button ref={prevRef} className={`${s.Arrow} ${s.Arrow_prev}`} aria-label="Previous">
				<Icon iconName={'arrow-left'} />
			</button>
			<button ref={nextRef} className={`${s.Arrow} ${s.Arrow_next}`} aria-label="Next">
				<Icon iconName={'arrow-right'} />
			</button>
			<Swiper
				modules={[Navigation, Pagination]}
				onBeforeInit={(swiper) => {
					// @ts-expect-error
					swiper.params.navigation.prevEl = prevRef.current;
					// @ts-expect-error
					swiper.params.navigation.nextEl = nextRef.current;
				}}
				navigation={{
					prevEl: prevRef.current,
					nextEl: nextRef.current,
				}}
				pagination={{
					el: '.swiper-pagination',
					clickable: true,
				}}
				simulateTouch={true}
				grabCursor={true}
				threshold={5}
				touchAngle={45}
				longSwipesRatio={0.5}
				slidesPerView={'auto'}
				loop={false}
				className={s.SwiperName}
			>
				{getSlides}
			</Swiper>
			<div className={`swiper-pagination ${s.Pagination}`} />
		</div>
	);
};
