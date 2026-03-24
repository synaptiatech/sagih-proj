import {
	CalendarToday,
	CleaningServices,
	EventAvailable,
	MeetingRoom,
	ScheduleSend,
} from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import swal from 'sweetalert';
import { ContentWithTitle } from '../../components/card/Content';
import FormReserva from '../../components/form/FormReserva';
import ErrorLayout from '../../components/layout/error';
import GridSkeleton from '../../components/layout/waiting';
import Paginacion from '../../components/paginacion/Paginacion';
import MiModal from '../../components/show/MiModal';
import { URI } from '../../consts/Uri';
import { TransactContext } from '../../contexts/TransactProvider';
import { transactTypes } from '../../hooks/transactReducer';
import { useFetch } from '../../hooks/useFetch';
import { useStore } from '../../hooks/useStore';
import { HabitacionType } from '../../props/HabitacionProps';
import { dataGet, dataUpdate } from '../../services/fetching.service';
import {
	AvailableImg,
	CleaningImg,
	RepairImg,
	Room4040Img,
} from '../../static';
import {
	cardStyleByStatus,
	cardStyleDefault,
	dashboardStyle,
} from '../../theme/FormStyle';

type ButtonByOperationProps = {
	title: string;
	operacion: string;
	habitacion: HabitacionType;
	enable?: boolean;
	onClick: (habitacion: HabitacionType, operacion: string) => void;
};

const IconHabitacionType = ({
	tipo,
	estado,
}: {
	tipo: string;
	estado: string;
}) => {
	if (tipo.toLocaleLowerCase().includes('simp')) {
		return (
			<Box
				sx={{
					fontSize: '1.2rem',
					...cardStyleByStatus(estado),
					background: 'transparent',
				}}>
				●
			</Box>
		);
	} else if (tipo.toLocaleLowerCase().includes('do')) {
		return (
			<Box
				sx={{
					fontSize: '1.2rem',
					...cardStyleByStatus(estado),
					background: 'transparent',
				}}>
				●●
			</Box>
		);
	} else if (tipo.toLocaleLowerCase().includes('tri')) {
		return (
			<Box
				sx={{
					fontSize: '1.2rem',
					...cardStyleByStatus(estado),
					background: 'transparent',
				}}>
				●●●
			</Box>
		);
	} else if (tipo.toLocaleLowerCase().includes('cuad')) {
		return (
			<Box
				sx={{
					fontSize: '1.2rem',
					...cardStyleByStatus(estado),
					background: 'transparent',
				}}>
				◪
			</Box>
		);
	} else if (tipo.toLocaleLowerCase().includes('suite')) {
		return (
			<Box
				sx={{
					fontSize: '1.2rem',
					...cardStyleByStatus(estado),
					background: 'transparent',
				}}>
				■
			</Box>
		);
	} else {
		return (
			<Box
				sx={{
					fontSize: '1.2rem',
					...cardStyleByStatus(estado),
					background: 'transparent',
				}}>
				◆
			</Box>
		);
	}
};

export const ButtonByOperation = ({
	title,
	operacion,
	habitacion,
	enable = true,
	onClick,
}: ButtonByOperationProps) => {
	if (!enable) return <></>;

	return (
		<Tooltip title={title}>
			<IconButton
				color='info'
				onClick={() => onClick(habitacion, operacion)}>
				{operacion === 'RE' ? (
					<ScheduleSend />
				) : operacion === 'CI' ? (
					<EventAvailable />
				) : operacion === 'CO' ? (
					<CalendarToday />
				) : operacion === 'L' ? (
					<CleaningServices />
				) : (
					<MeetingRoom />
				)}
			</IconButton>
		</Tooltip>
	);
};

const Home = () => {
	const { permisos } = useStore();
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [showModal, setShowModal] = useState(false);
	const { dispatch } = useContext(TransactContext);

	const {
		data: habitaciones,
		isLoading,
		error,
		refetch,
	} = useFetch({
		path: `${URI.habitacion._}/all`,
		table: 'v_habitacion',
		columns: {
			codigo: 'Código',
			nombre: 'Nombre',
			estado: 'Estado',
			precio: 'Precio',
			th_nombre: 'Tipo',
		},
		sort: { nivel: 'ASC', codigo: 'ASC' },
		pageNumber: page,
		pageSize: pages,
	});

	const cleanRoom = (habitacion: HabitacionType, operation: string) => {
		swal({
			title: 'Confirmación',
			text: `¿Está seguro que finalizó la ${
				operation === 'L' ? 'reparación' : 'limpieza'
			} en la habitación ${habitacion.nombre}?`,
			icon: 'warning',
			dangerMode: true,
			buttons: ['Cancelar', 'Aceptar'],
		}).then(async (value) => {
			if (value) {
				await dataUpdate({
					path: URI.habitacion._,
					data: { estado: operation },
					params: { codigo: habitacion.codigo },
				});
				refetch();
			}
		});
	};

	const transactRoom = async (
		habitacion: HabitacionType,
		operacion: string,
		mode: string
	) => {
		const titran =
			operacion === 'CO'
				? 'CI'
				: operacion === 'CI'
				? habitacion.estado === 'R'
					? 'RE'
					: 'CI'
				: 'RE';

		const { data } = await dataGet({
			path: `${URI.transaccion}/habitacion`,
			params: {
				habitacion: habitacion.codigo,
				tipo_transaccion: titran,
				estado: 0,
			},
		});
		dispatch({
			type: transactTypes.SET_TRAN_DATA,
			payload: {
				...data,
				habitacion,
				operacion: operacion === 'RE' ? 'RE' : 'CI',
				mode,
			},
		});
	};

	const modTransact = async (habitacion: HabitacionType) => {
		dispatch({ type: transactTypes.RESET });
		if (habitacion.estado === 'L' || habitacion.estado === 'N') {
			cleanRoom(habitacion, habitacion.estado === 'N' ? 'L' : 'D');
			return;
		}
		await transactRoom(
			habitacion,
			'CI',
			habitacion.estado === 'D' ? 'CREATE' : 'UPDATE'
		);
		setShowModal(true);
	};

	const showModalEvent = async (
		habitacion: HabitacionType,
		operacion: string
	) => {
		dispatch({ type: transactTypes.RESET });
		if (operacion === 'L' || operacion === 'D') {
			cleanRoom(habitacion, operacion);
			return;
		}

		await transactRoom(
			habitacion,
			operacion,
			operacion === 'CO' ? 'CLOSE' : 'CREATE'
		);
		setShowModal(true);
	};

	const handleChange = (event: ChangeEvent<unknown>, p: number) => {
		event.preventDefault();
		setPage(p);
	};

	const onClose = () => {
		setShowModal(false);
		dispatch({
			type: transactTypes.RESET,
		});
		refetch();
	};

	const canShow = (operation: string) => {
		if (operation === 'CI' || operation === 'CO') {
			return permisos.some(
				(p) =>
					p.nombre === 'Check in' ||
					p.nombre.includes('Servicios a') ||
					p.nombre === 'Pagos'
			);
		} else if (operation === 'RE') {
			return permisos.some((p) => p.nombre === 'Reservaciones');
		} else if (operation === 'L' || operation === 'D') {
			return permisos.some((p) => p.nombre === 'Check in');
		} else {
			return false;
		}
	};

	const getImageRoom = (state: string) => {
		switch (state) {
			case 'D':
				return AvailableImg;
			case 'O':
				return Room4040Img;
			case 'R':
				return Room4040Img;
			case 'N':
				return RepairImg;
			default:
				return CleaningImg;
		}
	};

	useEffect(() => {
		if (habitaciones) {
			setPages(habitaciones.pages);
		}
	}, [habitaciones]);

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<ContentWithTitle title='Panel de control'>
				<Box sx={{ mt: 3 }}>
					<Box component='div' pb={4} style={dashboardStyle}>
						{habitaciones?.rows.map(
							(habitacion: HabitacionType) => (
								<Box
									sx={{
										height: 125,
										position: 'relative',
									}}
									key={habitacion.nombre}
									component='div'
									className='flex flex-col place-content-center place-items-center rounded-lg hover:shadow-lg'
									style={{
										...cardStyleDefault,
										...cardStyleByStatus(habitacion.estado),
									}}>
									<Box
										sx={{
											cursor: 'pointer',
											px: 4,
										}}
										onClick={() => modTransact(habitacion)}>
										<img
											src={getImageRoom(
												habitacion.estado
											)}
											alt='Icon room'
											style={{
												width: '1.5rem',
												height: '1.5rem',
												opacity: 0.2,
												position: 'absolute',
												top: '2.4rem',
												right: '.5rem',
											}}
										/>
										<Typography variant='h4'>
											{habitacion.nombre}
										</Typography>
										<IconHabitacionType
											tipo={habitacion.th_nombre || ''}
											estado={habitacion.estado}
										/>
									</Box>
									{habitacion.estado === 'D' ? (
										<Box sx={{ display: 'flex', gap: 1 }}>
											<ButtonByOperation
												title='Reservar habitación'
												habitacion={habitacion}
												operacion='RE'
												enable={canShow('RE')}
												onClick={showModalEvent}
											/>
											<ButtonByOperation
												title='Check in'
												habitacion={habitacion}
												operacion='CI'
												enable={canShow('CI')}
												onClick={showModalEvent}
											/>
										</Box>
									) : habitacion.estado === 'O' ? (
										<Box sx={{ display: 'flex', gap: 1 }}>
											<ButtonByOperation
												title='Reservar habitación'
												habitacion={habitacion}
												operacion='RE'
												enable={canShow('RE')}
												onClick={showModalEvent}
											/>
											<ButtonByOperation
												title='Check out'
												habitacion={habitacion}
												operacion='CO'
												enable={canShow('CO')}
												onClick={showModalEvent}
											/>
										</Box>
									) : habitacion.estado === 'R' ? (
										<Box sx={{ display: 'flex', gap: 1 }}>
											<ButtonByOperation
												title='Reservar habitación'
												habitacion={habitacion}
												operacion='RE'
												enable={canShow('RE')}
												onClick={showModalEvent}
											/>
											<ButtonByOperation
												title='Check in'
												habitacion={habitacion}
												operacion='CI'
												enable={canShow('CI')}
												onClick={showModalEvent}
											/>
										</Box>
									) : habitacion.estado === 'N' ? (
										<Box sx={{ display: 'flex', gap: 1 }}>
											<ButtonByOperation
												title='Enviar a limpieza'
												habitacion={habitacion}
												operacion='L'
												enable={canShow('L')}
												onClick={showModalEvent}
											/>
										</Box>
									) : (
										<Box sx={{ display: 'flex', gap: 1 }}>
											<ButtonByOperation
												title='Marcar como disponible'
												habitacion={habitacion}
												operacion='D'
												enable={canShow('D')}
												onClick={showModalEvent}
											/>
										</Box>
									)}
								</Box>
							)
						)}
					</Box>
					<Paginacion
						count={pages}
						page={page}
						onChange={handleChange}
					/>
				</Box>
			</ContentWithTitle>
			{showModal && (
				<MiModal size='large' open={showModal} onClose={onClose}>
					<FormReserva onClose={onClose} />
				</MiModal>
			)}
		</>
	);
};

export default Home;
