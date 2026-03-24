import React from 'react';
import {
	Legend,
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	Tooltip,
} from 'recharts';
import { getRandomHEXColor } from '../utils/randomColor';

export type MiRadarProps = {
	size: { width: number; height: number };
	data: { name: string; value: number }[];
	dataKey: { xKey: string; yKeys: string };
	name: string;
};

const MiRadar: React.FC<MiRadarProps> = ({ size, data, name, dataKey }) => {
	const getMaxValue = (arr: Object[]) => {
		let max = 0;
		arr.forEach((item: any) => {
			if (item[dataKey.yKeys] > max) {
				max = item[dataKey.yKeys];
			}
		});
		return max;
	};

	return (
		<RadarChart
			outerRadius={90}
			width={size.width}
			height={size.height}
			data={data}>
			<PolarGrid />
			<PolarAngleAxis dataKey={dataKey.xKey} />
			<PolarRadiusAxis angle={30} domain={[0, getMaxValue(data)]} />
			<Radar
				name={name}
				dataKey={dataKey.yKeys}
				stroke={getRandomHEXColor()}
				fill={getRandomHEXColor()}
				fillOpacity={0.6}
			/>
			<Legend />
			<Tooltip />
		</RadarChart>
	);
};

export default MiRadar;
