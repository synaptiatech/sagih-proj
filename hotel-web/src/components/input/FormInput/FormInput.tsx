'use client';
import { TextField } from '@mui/material';
import React, { FC, HTMLInputTypeAttribute } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { inputFormatValue } from '../../../utils/Formateo';

export type FormInputProps = {
	control: Control<FieldValues>;
	name: Path<FieldValues>;
	label: string;
	type?: HTMLInputTypeAttribute;
	disabled?: boolean;
	customOnChange?: (value: any) => void;
};

const FormInput: FC<FormInputProps> = ({
	control,
	name,
	label,
	type = 'text',
	disabled = false,
	customOnChange,
}) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => (
				<TextField
					{...field}
					label={label}
					variant='standard'
					type={type}
					value={inputFormatValue(type, field.value)}
					disabled={disabled}
					InputLabelProps={{ shrink: true }}
					onChange={(e) => {
						field.onChange(e);
						if (customOnChange) customOnChange(e.target.value);
					}}
					error={!!error}
					helperText={error?.message || ''}
				/>
			)}
		/>
	);
};

export default FormInput;
