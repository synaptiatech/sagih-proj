import React from 'react';
import {
	CartesianGrid,
	Label,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { MiGraphProps } from '../props/MiGraphProps';
import { getRandomHEXColor } from '../utils/randomColor';

// export type MiLineProps = {
// }

const MiLine: React.FC<MiGraphProps> = ({ size, data, dataKey }) => {
	return (
		<>
			<LineChart
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
					<Line
						key={index}
						type='monotone'
						dataKey={yKey}
						fill={getRandomHEXColor()}
					/>
				))}
			</LineChart>
		</>
	);
};

export default MiLine;
