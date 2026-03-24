import { MouseEvent } from 'react';

export interface DrawerProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export interface DrawerItemProps {
	href: string;
	title: string;
	onClick: (event: MouseEvent) => void;
}

export interface AccountPopoverProps {
	anchorEl: HTMLDivElement | null;
	setOpen: (open: boolean) => void;
	open: boolean;
}
