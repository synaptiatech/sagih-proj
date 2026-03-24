import { MouseEvent } from 'react';
import { DATATYPE } from '../consts/datatype';

export interface ParamField {
	index: number;
	name: string;
	value: string;
}

export interface FieldForm {
	name: string;
	label: string;
	value: string | number;
	datatype: DATATYPE;
	error: string;
	validate: RegExp[];
}

export interface FormProps {
	open: boolean;
	flexDirection: string;
	fields: FieldForm[];
	onClose: () => void;
	setFields: (fields: any[]) => void;
	submit: (event: MouseEvent) => void;
}
