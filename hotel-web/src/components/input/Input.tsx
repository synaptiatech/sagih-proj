import { TextField } from '@mui/material';

interface TextProps {
	label: string;
	name?: string;
	type?: string;
	value: any;
}

export const TextOnlyRead = ({ label, value }: TextProps) => (
	<TextField
		label={label}
		value={value}
		variant='standard'
		sx={{
			width:
				`${label}`.length > `${value}`.length
					? `${label}`.length * 10
					: `${value}`.length * 10,
		}}
		inputProps={{ readOnly: true }}
	/>
);
