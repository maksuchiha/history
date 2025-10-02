import { makeToken } from './makeToken';

export function createSwiperSelectors(prefix = 'js-swiper') {
	const token = makeToken();
	return {
		token,
		prevCls: `${prefix}-prev-${token}`,
		nextCls: `${prefix}-next-${token}`,
		pagCls: `${prefix}-pag-${token}`,
	};
}
