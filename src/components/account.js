import React, { Component } from 'react';
import './styles/account.css';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Navigation from '../components/header';

class Account extends Component {
	constructor() {
		super();
		this.state = {
			storage: false, // screen display selector
			items: [], // database items
			data: []
		};
	}

	// handle user gif delete
	async handleDeleteGif(id) {
		// send email and gif id through api gateway where lambda will delete from database
		await axios
			.post('https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-delete-gif', {
				email: localStorage.getItem('userEmail'),
				gif: id
			})
			.then((res) => {
				console.log('Gif Deleted From Account!');
			})
			.catch((err) => {
				console.log(err);
			});

		// refresh page to see update
		window.location.reload(false);
	}

	// handle fetching all users gifs
	handleFetch(gifIdString) {
		const self = this;
		// Load the AWS SDK
		var AWS = require('aws-sdk'),
			secretName = 'giphyKey',
			secret;

		// create a secrets manager client
		var client = new AWS.SecretsManager({
			region: process.env.REACT_APP_AWS_REGION,
			accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
			secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
			sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN
		});

		// getting the secret value (giphy api key)
		client.getSecretValue({ SecretId: secretName }, function(err, data) {
			// if error occurs getting the key then throw
			if (err) {
				console.log(err);
				throw err;
			} else {
				// successfully retrieved key
				if ('SecretString' in data) {
					// cut it to get exact string
					secret = data.SecretString.substring(8, 40);
				}
			}
			// fetch gifs from giphy api
			const fetchGifs = async () => {
				const retrievedGifs = await axios('https://api.giphy.com/v1/gifs', {
					params: {
						// grabbing the secret key and ids of gif
						api_key: secret,
						ids: gifIdString
					}
				});

				// setting state of gifs and storage
				if (Object.keys(retrievedGifs.data.data).length > 0) {
					self.setState({ data: retrievedGifs.data.data });
					self.setState({ storage: true });
				}
			};
			fetchGifs();
		});
	}

	// fetching all gifs in database
	getGifIds() {
		// passing users email through api gateway where lambda will query for all users gifs
		axios
			.post('https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-get-gifs', {
				email: localStorage.getItem('userEmail')
			})
			.then((res) => {
				// setting state to fetch database items
				this.setState({ items: res.data.Items });
				var gifs = this.state.items.map((item) => item.Gif);
				if (gifs.length > 0) {
					this.setState({ items: gifs });
					var gifIdString = '';
					// creating a long string of gif ids to send to handlefetch()
					// string will look like this gifId1, gifId2, gifId3
					for (var i = 0; i < gifs.length; i++) {
						if (i + 1 === gifs.length) {
							gifIdString += gifs[i];
						} else {
							gifIdString += gifs[i] + ', ';
						}
					}
					// calling handleFetch with created gif string
					this.handleFetch(gifIdString);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	componentDidMount() {
		// get all gifs on first load
		this.getGifIds();
	}

	render() {
		return (
			<div>
				<Navigation />
				<div className="account-component">
					<Typography variant="h4" style={{ color: 'white', paddingTop: '25px', textAlign: 'center' }}>
						Your favourite Gifs
					</Typography>
					{/* if storage is true display all users gifs */}
					{this.state.storage ? (
						<div className="account">
							<div className="account-results">
								{this.state.data.map((gif, index) => (
									<Paper
										key={gif.id}
										elevation={3}
										style={{
											float: 'left',
											width: '400px',
											height: '280px',
											backgroundColor: '#0e151c',
											padding: '35px'
										}}
									>
										<Card style={{ maxWidth: '365' }}>
											<CardMedia
												style={{ height: '0', paddingTop: '56.25%' }}
												image={gif.images.fixed_height.url}
												title={gif.title}
											/>
											<CardActions disableSpacing style={{ backgroundColor: '#61dafb' }}>
												<IconButton
													onClick={() => this.handleDeleteGif(gif.id)}
													id={gif.id}
													aria-label="add"
												>
													<FavoriteIcon style={{ color: '#d86eca' }} />
												</IconButton>
											</CardActions>
										</Card>
									</Paper>
								))}
							</div>
						</div>
					) : (
						/* if storage is false display empty storage */
						<div className="account">
							<div className="empty-account">
								<Paper style={{ backgroundColor: '#0e151c' }} className="account-paper" elevation={24}>
									<Typography
										variant="h5"
										style={{
											height: '100%',
											color: '#61dafb',
											paddingTop: '25px',
											textAlign: 'center'
										}}
									>
										Empty Storage
									</Typography>
								</Paper>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default Account;
