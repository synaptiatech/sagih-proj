// Por hacer:
// verificarVacio([nombre, porcentaje]) -> []
// verificarTexto()
// verificarNumero()
// verificarFecha()
// interpretarRegistrosRepetidos()
// interpretarConstraintForaneas()

export const EMPTY_FIELD = /\S/;
export const NUMBER_FIELD = /\D/;
export const STRING_FIELD = /\S/;
export const DATE_FIELD = /\s/;

export const isEmpty = (field: string | number): boolean => {
	if (typeof field === 'string') {
		return !field.match(EMPTY_FIELD);
	}
	return false;
};

export const isValid = (field: string | number, matcher: RegExp): boolean => {
	let testing: string = `${field}`;
	return !testing.match(matcher);
};
