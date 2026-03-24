import { Box, Button, FormLabel, Input, Typography } from '@mui/material';
import React, { ChangeEvent, DragEvent, useState } from 'react';
import './FileUpload.css';

export type FileUploadProps = {
	title?: string;
	onUpload: (file: File) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({
	title = 'Arrastra tu archivo',
	onUpload,
}) => {
	const [active, setActive] = useState(false);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) onUpload(e.target.files[0]);
	};
	const onDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setActive(true);
	};
	const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setActive(false);
	};
	const onDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files.length) onUpload(e.dataTransfer.files[0]);
	};

	return (
		<>
			<Box
				sx={{
					backgroundColor: active
						? 'action.focus'
						: 'background.paper',
					borderRadius: 1,
					boxSizing: 'border-box',
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
					p: 1,
					placeContent: 'center',
					placeItems: 'center',
					placeSelf: 'stretch',
					width: 250,
					height: 200,
				}}
				component='div'
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}>
				<Typography variant='h6'>{title}</Typography>
				<Typography variant='body1'>Arrastra y suelta aquí</Typography>
				<Typography variant='body2'>o</Typography>
				<FormLabel htmlFor='file'>
					<Button variant='contained' component='span'>
						Selecciona tu archivo
					</Button>
				</FormLabel>
				<Input
					type='file'
					name='file'
					id='file'
					style={{ display: 'none' }}
					onChange={onChange}
				/>
			</Box>
		</>
	);
};

export default FileUpload;
