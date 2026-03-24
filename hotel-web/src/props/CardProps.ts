import { MouseEvent } from 'react';

export interface CardContentProps {
	children: JSX.Element | JSX.Element[];
	title?: string;
}

export interface CardResumeProps extends CardContentProps {
	detail: string;
	color: string;
	action: (event: MouseEvent) => void;
}
