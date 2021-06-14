import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Navigation extends Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleAccountDelete = this.handleAccountDelete.bind(this);
	}
	// logout button clicked remove local storage
	handleLogout = () => {
		localStorage.clear();
	};

	// delete account button clicked
	handleAccountDelete = () => {
		const email = localStorage.getItem('userEmail');
		// get users email and password from database using api gatway and lambda
		axios
			.post('https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-get-user', {
				email: email
			})
			.then((res) => {
				// item exists
				if (res.data.Items.length > 0) {
					// delete from database using partition and range key
					axios
						.post(
							'https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-delete-user',
							{
								email: email,
								password: res.data.Items[0].Password
							}
						)
						// deleted account
						.then((res) => {
							console.log('Successfully deleted');
						})
						// error occurred
						.catch((err) => {
							console.log('User Delete Error', err);
						});
				}
			})
			.catch((err) => {
				console.log('User Info Error', err);
			});
	};

	render() {
		return (
			<div>
				{localStorage.getItem('userEmail') ? (
					/* show user links on header */
					<React.Fragment>
						<AppBar position="fixed" style={{ backgroundColor: 'transparent' }} elevation={0}>
							<Toolbar>
								<div style={{ flexGrow: '3', borderRadius: '16px' }}>
									<Button color="inherit" component={Link} to="/search">
										<Typography variant="h4">GIFO</Typography>
									</Button>
								</div>
								<div>
									<Button
										color="inherit"
										component={Link}
										to="/account"
										style={{
											marginRight: '16px',
											borderRadius: '16px',
											color: 'black',
											backgroundColor: '#61dafb'
										}}
									>
										Storage
									</Button>
									<Button
										onClick={this.handleAccountDelete}
										color="inherit"
										component={Link}
										to="/login"
										style={{
											marginRight: '16px',
											borderRadius: '16px',
											color: 'black',
											backgroundColor: '#61dafb'
										}}
									>
										Delete Account
									</Button>
									<Button
										onClick={this.handleLogout}
										color="inherit"
										component={Link}
										to="/login"
										style={{ borderRadius: '16px', color: 'black', backgroundColor: '#61dafb' }}
									>
										Logout
									</Button>
								</div>
							</Toolbar>
						</AppBar>
					</React.Fragment>
				) : (
					/* show non user links on header */
					<React.Fragment>
						<AppBar position="fixed" style={{ backgroundColor: 'transparent' }} elevation={0}>
							<Toolbar>
								<div style={{ flexGrow: '3', borderRadius: '16px' }}>
									<Button color="inherit" component={Link} to="/login">
										<Typography variant="h4">GIFO</Typography>
									</Button>
								</div>
								<div>
									<Button
										color="inherit"
										component={Link}
										to="/login"
										style={{
											marginRight: '16px',
											borderRadius: '16px',
											color: 'black',
											backgroundColor: '#61dafb'
										}}
									>
										Login
									</Button>
									<Button
										color="inherit"
										component={Link}
										to="/register"
										style={{ borderRadius: '16px', color: 'black', backgroundColor: '#61dafb' }}
									>
										Register
									</Button>
								</div>
							</Toolbar>
						</AppBar>
					</React.Fragment>
				)}
			</div>
		);
	}
}

export default Navigation;
