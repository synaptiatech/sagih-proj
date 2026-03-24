'use client';
import React from 'react';
import { createPortal } from 'react-dom';

export type ModalPortalProps = {
	children?: React.ReactNode;
};

const ModalPortal: React.FC<ModalPortalProps> = ({ children }) => {
	return createPortal(
		<div>{children}</div>,
		document.getElementById('modal-root') as HTMLElement
	);
};

export default ModalPortal;
