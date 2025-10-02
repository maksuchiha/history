import React, { FC } from 'react';

export type IconPropsType = {
	iconName: string;
};

type iconsType = {
	[key: string]: React.ReactNode;
};

export const Icon: FC<IconPropsType> = ({ iconName }) => {
	const icons: iconsType = {
		'arrow-left': (
			<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke="#42567A" strokeWidth="2" />
			</svg>
		),
		'arrow-right': (
			<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M1.50012 0.750001L7.75012 7L1.50012 13.25" stroke="#42567A" strokeWidth="2" />
			</svg>
		),
		// Добавьте другие иконки по аналогии
	} as const;

	return icons[iconName] || 'icon';
};
