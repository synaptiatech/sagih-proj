export const downloadFileByBloodPart = (data: BlobPart, filename: string) => {
	const url = window.URL.createObjectURL(new Blob([data]));
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute(
		'download',
		`${filename}_${new Date().toDateString()}.pdf`
	);
	document.body.appendChild(link);
	link.click();
};
