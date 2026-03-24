export interface InputProps {
	type: string;
	name: string;
	label: string;
	value: string;
	setValue: (value: string) => void;
}
