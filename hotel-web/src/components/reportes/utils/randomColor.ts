export const getRandomHEXColor = (index?: number) => {
	const colorIndex = index || Math.floor(Math.random() * 8);
	const colors = [
		'#525FE1',
		'#F86F03',
		'#FFA41B',
		'#9336B4',
		'#FFE79B',
		'#FF52A2',
		'#00DFA2',
		'#009FBD',
	];
	return colors[colorIndex];
};
