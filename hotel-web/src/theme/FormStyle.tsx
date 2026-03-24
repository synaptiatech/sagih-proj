export const rowFlex = {
	display: 'flex' as 'flex',
	placeContent: 'space-between',
	flexWrap: 'wrap' as 'wrap',
	py: 2,
	gap: 2,
};

export const style = {
	display: 'grid' as 'grid',
	placeContent: 'center',
	width: '100%',
	height: '100%',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	overflow: 'auto',
};

export const gridStyle = {
	display: 'grid' as 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
	gap: 2,
	width: '100%',
};

export const dashboardStyle = {
	display: 'grid' as 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
	gap: 4,
};

export const cardStyleDefault = {
	minHeight: 100,
	padding: '1em 0',
};

export const cardStyleByStatus = (estado: string) => {
	switch (estado) {
		case 'D': // Disponible -> Check In | Reserva
			return {
				// ...cardStyleDefault,
				background:
					'linear-gradient(110.1deg, rgb(34, 126, 34, .80) 2.9%, rgb(168, 251, 60, .80) 90.3%)',
				color: 'white',
			};
		case 'O': // Ocupado -> Reserva
			return {
				// ...cardStyleDefault,
				background:
					'linear-gradient(109.6deg, rgb(162, 2, 63, .80) 11.2%, rgb(231, 62, 68, .80) 53.6%, rgb(255, 129, 79, .80) 91.1%)',
				color: 'white',
			};
		case 'R': // Reservado -> Check out
			return {
				// ...cardStyleDefault,
				background:
					'radial-gradient(circle at 10% 20%, rgb(255, 197, 61, .80) 0%, rgb(255, 94, 7, .80) 90%)',
				color: 'black',
			};
		case 'N': // No disponible | Mantenimiento -> Liberar
			return {
				// ...cardStyleDefault,
				background:
					'radial-gradient(circle at 0% 0.5%, rgb(241, 241, 242) 0.1%, rgb(224, 226, 228) 100.2%)',
				color: 'black',
			};
		default: // Limpieza -> Liberar
			return {
				// ...cardStyleDefault,
				background:
					'radial-gradient(circle at 10% 20%, rgb(254, 255, 165) 0%, rgb(255, 232, 182) 90%)',
				color: 'black',
			};
	}
};
