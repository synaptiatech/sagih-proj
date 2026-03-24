import { Button, Card, Typography } from '@mui/material';
import { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Content, ContentWithTitle } from '../components/card/Content';
import FilasBox from '../utils/FilasFlex';

export class ErrorBoundary extends Component<
	{ children: ReactNode },
	{ hasError: boolean }
> {
	state = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// You can also log the error to an error reporting service
		console.log('Uncaught error:', error, errorInfo);
	}

	private resetError() {
		// this.setState({ hasError: false });
		window.location.reload();
		console.log('Error reseted', this.state);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<>
					<ContentWithTitle title='Error'>
						<Card sx={{ mb: 4 }}>
							<Content>
								<>
									<FilasBox>
										<Typography variant='h5'>
											¡No eres tú! Algo salió mal de
											nuestra parte
										</Typography>
									</FilasBox>
									<Button
										color='primary'
										variant='contained'
										onClick={this.resetError}>
										Intentar de nuevo
									</Button>
								</>
							</Content>
						</Card>
					</ContentWithTitle>
				</>
			);
		}

		return this.props.children;
	}
}
