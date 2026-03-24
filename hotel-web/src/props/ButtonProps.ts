import { MouseEvent, ReactNode } from 'react';

export interface ButtonProps {
	children: ReactNode;
	handle: (event: MouseEvent) => void;
}
