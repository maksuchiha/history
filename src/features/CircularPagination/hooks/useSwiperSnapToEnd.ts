import { useCallback, useRef } from 'react';
import type { Swiper as SwiperClass } from 'swiper';

export function useSwiperSnapToEnd(isMobile: boolean, duration = 350) {
	const isMobileRef = useRef(isMobile);
	isMobileRef.current = isMobile;

	return useCallback(
		(inst: SwiperClass) => {
			if (!isMobileRef.current) return;
			const lastIndex = inst.slides.length - 1;
			if (inst.isEnd && inst.activeIndex !== lastIndex) {
				requestAnimationFrame(() => inst.slideTo(lastIndex, duration));
			}
		},
		[duration],
	);
}
