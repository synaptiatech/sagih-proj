import React from 'react';
import { Legend, RadialBar, RadialBarChart, Tooltip } from 'recharts';

export interface DataKey {
	name: string;
	dataKey: number;
	fill: string;
}

export type MiRadialProps = {
	data: DataKey[];
};

const MiRadial: React.FC<MiRadialProps> = ({ data }) => {
	return (
		<>
			<RadialBarChart
				width={730}
				height={250}
				innerRadius='10%'
				outerRadius='80%'
				data={data}
				startAngle={180}
				endAngle={0}>
				<RadialBar
					label={{ fill: '#666', position: 'insideStart' }}
					background
					dataKey='dataKey'
				/>
				<Legend
					iconSize={10}
					width={120}
					height={140}
					layout='vertical'
					verticalAlign='middle'
					align='right'
				/>
				<Tooltip />
			</RadialBarChart>
		</>
	);
};

export default MiRadial;
