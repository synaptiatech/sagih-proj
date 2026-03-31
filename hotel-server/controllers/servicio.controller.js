export const getDataForReportes = async (req, res) => {
	try {
		const { rows: servicios } = await getQueryMethod({
			table: tablesName.SERVICIO,
		});

		const { rows: clientes } = await getQueryMethod({
			table: tablesName.CLIENTE,
		});

		const { rows: habitacion } = await getQueryMethod({
			table: tablesName.HABITACION,
			columns: {
				codigo: 'codigo',
				nombre: 'nombre',
			},
			limit: 200, // 🔥 clave
		});

		const { rows: tiTran } = await getQueryMethod({
			table: tablesName.TI_TRAN,
		});

		res.status(200).json({ servicios, clientes, habitacion, tiTran });
	} catch (error) {
		errorHandler(res, error);
	}
};
