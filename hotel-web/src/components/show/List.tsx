import { Delete, Edit, Print } from '@mui/icons-material';
import {
	Card,
	CardHeader,
	Container,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';
import { ListProps } from '../../props/ShowProps';

export const AsList = ({
	items,
	onDelete,
	onEdit,
	onDownload = undefined,
}: ListProps) => {
	if (items.length === 0) {
		return (
			<Container maxWidth='sm' sx={{ mb: 4 }}>
				<Card>
					<CardHeader title='Registros' />
					<Divider />
					<List>
						<ListItem
							sx={{
								px: 2,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<ListItemText
								primary='No hay registros'
								sx={{ flex: 3 }}
							/>
						</ListItem>
					</List>
				</Card>
			</Container>
		);
	}

	return (
		<Container maxWidth='sm' sx={{ mb: 4 }}>
			<Card
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
				}}>
				<CardHeader title='Registros' />
				<Divider />
				<List>
					{items.map((item, index) => (
						<ListItem
							key={index}
							divider
							sx={{
								px: 2,
								display: 'flex',
								justifyContent: 'flex-start',
								alignItems: 'center',
							}}>
							<ListItemText
								primary={item.name}
								sx={{ flex: 3 }}
							/>
							{item.description && (
								<>
									{item.description.primary && (
										<ListItemText
											sx={{
												textAlign: 'right',
												ml: 2,
												flex: 2,
												textOverflow: 'ellipsis',
											}}
											primary={item.description.primary}
										/>
									)}
									{item.description.secondary && (
										<ListItemText
											sx={{
												textAlign: 'right',
												ml: 2,
												flex: 1,
												textOverflow: 'ellipsis',
											}}
											secondary={
												item.description.secondary
											}
										/>
									)}
								</>
							)}
							<IconButton
								color='warning'
								onClick={() => onDelete(item.id)}>
								<Delete />
							</IconButton>
							<IconButton
								color='info'
								onClick={() => onEdit(item.id)}>
								<Edit />
							</IconButton>
							{onDownload && (
								<IconButton
									color='primary'
									onClick={() => onDownload(item.id)}>
									<Print />
								</IconButton>
							)}
						</ListItem>
					))}
				</List>
			</Card>
		</Container>
	);
};
