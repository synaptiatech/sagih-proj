import React from 'react';
import { Pie, PieChart } from 'recharts';
import { getRandomHEXColor } from '../utils/randomColor';

export type MiPieProps = {
	size: { width: number; height: number };
	data: Object[];
	dataKey: { name: string; value: string };
};

const MiPie: React.FC<MiPieProps> = ({ size, data, dataKey }) => {
	const data02 = [
		{
			name: 'Group A',
			value: 400,
		},
		{
			name: 'Group B',
			value: 300,
		},
		{
			name: 'Group C',
			value: 300,
		},
		{
			name: 'Group D',
			value: 200,
		},
		{
			name: 'Group E',
			value: 278,
		},
		{
			name: 'Group F',
			value: 189,
		},
	];
	console.log({ data02, data });
	return (
		<>
			<PieChart width={size.width} height={size.height}>
				{/* <Pie
					data={data}
					dataKey={dataKey.value}
					nameKey={dataKey.name}
					cx={'50%'}
					cy={'50%'}
					outerRadius={50}
					fill='#8884d8'
					label
				/> */}
				<Pie
					data={data}
					dataKey={dataKey.value}
					nameKey={dataKey.name}
					cx='50%'
					cy='50%'
					innerRadius={40}
					outerRadius={80}
					fill={getRandomHEXColor()}
					label
				/>
			</PieChart>
		</>
	);
};

export default MiPie;
