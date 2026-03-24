import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

export type Option = {
	id: any;
	label: string;
};

export type AutocompleteProps = {
	control: Control<FieldValues>;
	name: Path<FieldValues>;
	options: Option[];
	placeholder?: string;
	customOnChange?: (value: any) => void;
};

const MiAutocomplete: React.FC<AutocompleteProps> = ({
	control,
	name,
	placeholder,
	options = [],
	customOnChange = undefined,
}) => {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => {
				const { onChange, value, ref } = field;
				return (
					<Autocomplete
						options={options}
						value={
							value
								? options.find(
										(option: Option) => value === option.id
								  ) ?? null
								: null
						}
						getOptionLabel={(option: Option) => option.label ?? ''}
						isOptionEqualToValue={(option: Option, value: Option) =>
							value ? option.id === value.id : false
						}
						onChange={(_event: any, newValue) => {
							if (customOnChange)
								customOnChange(newValue ? newValue.id : null);
							else onChange(newValue ? newValue.id : null);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								sx={{
									width: 150,
								}}
								variant='standard'
								label={placeholder}
								error={!!error}
								helperText={error?.message ?? null}
							/>
						)}
					/>
				);
			}}
		/>
	);
};

export default MiAutocomplete;
