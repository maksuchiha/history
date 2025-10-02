import { useRef, useCallback } from 'react';
import type { Swiper as SwiperClass } from 'swiper';

export function useSwiperTail(isMobile: boolean) {
	const isMobileRef = useRef(isMobile);
	const lastGapRef = useRef(0);

	isMobileRef.current = isMobile;

	return useCallback((inst?: SwiperClass | null) => {
		const swiper = inst;
		if (!swiper || !swiper.slides?.length) return;

		if (!isMobileRef.current) {
			if ((swiper.params.slidesOffsetAfter ?? 0) !== 0) {
				swiper.params.slidesOffsetAfter = 0;
				lastGapRef.current = 0;
				swiper.update();
			}
			return;
		}

		requestAnimationFrame(() => {
			const slides = swiper.slides as unknown as HTMLElement[];
			const lastEl = slides[slides.length - 1];
			if (!lastEl) return;

			const gap = Math.max(0, swiper.width - lastEl.offsetWidth);
			if (gap !== lastGapRef.current) {
				lastGapRef.current = gap;
				swiper.params.slidesOffsetAfter = gap;
				swiper.update();
			}
		});
	}, []);
}
