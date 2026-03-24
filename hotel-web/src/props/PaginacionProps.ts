import { ChangeEvent } from 'react';

export interface PaginacionProps {
	count: number;
	page: number;
	onChange: (event: ChangeEvent<unknown>, p: number) => void;
}
