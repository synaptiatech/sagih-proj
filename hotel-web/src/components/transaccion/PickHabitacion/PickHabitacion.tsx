'use client';
import React, { Context, useContext } from 'react';
import { transactTypes } from '../../../hooks/transactReducer';
import { TransactContext } from '../../../contexts/TransactProvider';
import { useFetch } from '../../../hooks/useFetch';
import { URI } from '../../../consts/Uri';
import { HabitacionType } from '../../../props/HabitacionProps';
import { Autocomplete, TextField } from '@mui/material';

export type PickHabitacionProps = {
	titran: string;
};

const PickHabitacion: React.FC<PickHabitacionProps> = ({ titran }) => {
	const { state, dispatch } = useContext(TransactContext);
	const { data, isLoading, isError } = useFetch({
		path: `${URI.general}/all`,
		table: 'fn_room_without_trans',
	});

	const onChange = (habitacion: HabitacionType) => {
		dispatch({
			type: transactTypes.UPDATE_HABITACION,
			payload: habitacion,
		});
	};

	if (isLoading) return <p>Habitaciones...</p>;
	if (isError) return <p>Error en habitaciones</p>;

	return (
		<Autocomplete
			options={data?.rows || []}
			getOptionLabel={(option: HabitacionType) => `${option.nombre}`}
			onChange={(e, habitacion: any) =>
				onChange(habitacion || ({} as HabitacionType))
			}
			renderInput={(params) => (
				<TextField
					{...params}
					sx={{ width: 105 }}
					label='Cambiar habitación'
					variant='standard'
				/>
			)}
		/>
	);
};

export default PickHabitacion;
