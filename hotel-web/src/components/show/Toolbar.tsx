import { Close } from '@mui/icons-material';
import Download from '@mui/icons-material/Download';
import Search from '@mui/icons-material/Search';
import Upload from '@mui/icons-material/Upload';
import {
	Box,
	Button,
	Card,
	CardContent,
	InputAdornment,
	SvgIcon,
	TextField,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { ToolbarProps } from '../../props/ShowProps';

export const Toolbar = ({
	title,
	onSearch,
	onCreate,
	onDownload,
	onUpload,
	...props
}: ToolbarProps) => {
	const [filter, setFilter] = useState('');

	const handleChange = (e: any) => {
		setFilter(e.target.value);
		// if (onSearch) onSearch(e.target.value);
	};

	const handleClear = () => {
		setFilter('');
		if (onSearch) onSearch('');
	};

	return (
		<Box {...props}>
			<Box
				sx={{
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					m: -1,
				}}>
				<Typography sx={{ m: 1 }} variant='h4'>
					{title}
				</Typography>
				<Box sx={{ m: 1 }}>
					{onUpload && (
						<Button
							startIcon={<Upload fontSize='small' />}
							sx={{ mr: 1 }}
							onClick={onUpload}>
							Cargar datos
						</Button>
					)}
					<Button
						startIcon={<Download fontSize='small' />}
						sx={{ mr: 1 }}
						onClick={onDownload}>
						Imprimir
					</Button>
					<Button
						color='primary'
						variant='contained'
						onClick={onCreate}>
						Agregar
					</Button>
				</Box>
			</Box>
			<Box sx={{ mt: 3 }}>
				<Card>
					<CardContent>
						<Box>
							<TextField
								fullWidth
								InputProps={{
									endAdornment: (
										<>
											<InputAdornment position='end'>
												<SvgIcon
													color='action'
													fontSize='small'
													cursor='pointer'
													onClick={() =>
														handleClear()
													}>
													<Close />
												</SvgIcon>
											</InputAdornment>
											<Button
												variant='text'
												color='primary'
												onClick={() =>
													onSearch && onSearch(filter)
												}>
												<Search />
											</Button>
										</>
									),
								}}
								placeholder={`Buscar ${title.toLowerCase()}`}
								variant='outlined'
								value={filter}
								onChange={handleChange}
							/>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};

export const ToolbarOnlyRead = ({
	title,
	onSearch = undefined,
	onDownload = undefined,
}: ToolbarProps) => {
	const [filter, setFilter] = useState('');

	const handleChange = (e: any) => {
		setFilter(e.target.value);
		// if (onSearch) onSearch(e.target.value);
	};

	const handleClear = () => {
		setFilter('');
		if (onSearch) onSearch('');
	};

	return (
		<Box>
			<Box
				sx={{
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					m: -1,
				}}>
				<Typography sx={{ m: 1 }} variant='h4'>
					{title}
				</Typography>
				{onDownload && (
					<Box sx={{ m: 1 }}>
						<Button
							startIcon={<Download fontSize='small' />}
							sx={{ mr: 1 }}
							onClick={onDownload}>
							Imprimir
						</Button>
					</Box>
				)}
			</Box>
			{onSearch && (
				<Box sx={{ mt: 3 }}>
					<Card>
						<CardContent>
							<Box sx={{}}>
								<TextField
									fullWidth
									InputProps={{
										endAdornment: (
											<>
												<InputAdornment position='end'>
													<SvgIcon
														color='action'
														fontSize='small'
														cursor='pointer'
														onClick={() =>
															handleClear()
														}>
														<Close />
													</SvgIcon>
												</InputAdornment>
												<Button
													variant='text'
													color='primary'
													onClick={() =>
														onSearch &&
														onSearch(filter)
													}>
													<Search />
												</Button>
											</>
										),
									}}
									placeholder={`Buscar ${title.toLowerCase()}`}
									variant='outlined'
									value={filter}
									onChange={handleChange}
								/>
							</Box>
						</CardContent>
					</Card>
				</Box>
			)}
		</Box>
	);
};
