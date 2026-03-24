import React from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Label,
	Legend,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { MiGraphProps } from '../props/MiGraphProps';
import { getRandomHEXColor } from '../utils/randomColor';

const MiBar: React.FC<MiGraphProps> = ({ size, data, dataKey }) => {
	return (
		<>
			<BarChart
				width={size.width}
				height={size.height}
				data={data}
				margin={{ top: 0, right: 0, left: 5, bottom: 5 }}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey={dataKey.x.xKey}>
					<Label value={dataKey.x.label} position='bottom' />
				</XAxis>
				<YAxis
					label={{
						value: dataKey.y.label,
						angle: -90,
						position: 'insideBottomLeft',
					}}
				/>
				<Tooltip />
				<Legend align='right' />
				{dataKey.y.yKeys.map((yKey: string, index: number) => (
					<Bar
						key={index}
						dataKey={yKey}
						fill={getRandomHEXColor()}
					/>
				))}
			</BarChart>
		</>
	);
};

export default MiBar;
