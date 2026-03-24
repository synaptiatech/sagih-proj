export type DataLabel = {
	x: { label: string; xKey: string };
	y: { label: string; yKeys: string[] };
};

export type MiGraphProps = {
	size: { width: number; height: number };
	data: Object[];
	dataKey: DataLabel;
};
