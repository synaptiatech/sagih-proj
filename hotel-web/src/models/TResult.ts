export type Field = {
	name: string;
	tableID: number;
	columnID: number;
	dataTypeID: number;
	dataTypeSize: number;
	dataTypeModifier: number;
	format: string;
};

export type TResult<T> = {
	command: string;
	rowCount: number;
	oid: number;
	rows: T[];
	fields: Field[];
	_parsers: any[];
	_types: any;
	RowCtor: any;
	rowAsArray: boolean;
};
