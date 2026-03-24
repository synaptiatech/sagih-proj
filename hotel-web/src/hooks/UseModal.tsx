'use client';

import { useState } from 'react';

export const UseModal = (initialState: boolean = false) => {
	const [isOpen, setIsOpen] = useState(initialState);

	const openModal = () => setIsOpen(true);

	const closeModal = () => setIsOpen(false);

	return {
		isOpen,
		openModal,
		closeModal,
	};
};
