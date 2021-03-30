import React, { Component } from "react";
import "./styles/search.css";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Navigation from '../components/header';

class Search extends Component {
    constructor() {
        super();
        this.state = {
          search: false, // screen display selector
          searchTag: "", // users input
          data: [] // gif items
        };
        this.handleSearchTag = this.handleSearchTag.bind(this);
        this.handleFavourite = this.handleFavourite.bind(this);
    }

    // updating search tag
    handleSearchTag = (searchTag) => {
        this.setState({
          searchTag: searchTag.target.value,
        });
    };
    
    // handling users clicks fav on gif
    async handleFavourite(id) {
        // posting email / gif id to lambda (where lambda will add gif to database)
        await axios.post(
        'https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-gifs',
        {
          "email": localStorage.getItem("userEmail"),
          "gif": id
        })
        .then((res) => {
            // successful insert
            console.log("Gif Saved To Account!");
        })
        .catch((err) => {
            // unsuccessful insert
            console.log(err);
        });  
    }

    // handling users inputted search  
    // grabbing gifs to dispaly
    handleSearch = (e) => {   
       


        e.preventDefault();
        const self = this; 

        // loading the AWS SDK and using my key name
        var AWS = require('aws-sdk'),
        secretName = "giphyKey",
        secret;

        // creating a secrets manager client
        var client = new AWS.SecretsManager({ 
            region: process.env.REACT_APP_AWS_REGION,
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN
        });

        // getting the secret value (giphy api key)
        client.getSecretValue({SecretId: secretName}, function(err, data) {
            // if error occurs getting the key then throw
            if (err) {
                console.log(err);
                throw err;                     
            }
            // successfully retrieved key
            else {
                if ('SecretString' in data) {
                    // cut it to get exact string
                    secret = data.SecretString.substring(8, 40);
                } 
            }

            // fetch gifs from giphy api
            const fetchGifs = async () => {
                const retrievedGifs = await axios("https://api.giphy.com/v1/gifs/search", {
                    // setting params a 15 limit and with users search and secret from aws secret manager
                    params: { 
                        api_key: secret,
                        q: self.state.searchTag,
                        limit: process.env.NUMBER,
                    }
                });
                
                // setting state of gifs and search
                if(Object.keys(retrievedGifs.data.data).length > 0){     
                    self.setState({ data: retrievedGifs.data.data});
                    self.setState({ search: true });
                }    
            }
            fetchGifs()
        });  
    };

    render() {
        return ( 
            <div>
                <Navigation />
                <div className="search-component">
                    <Typography variant="h4" style={{ color: "white", paddingTop: "25px", textAlign: "center"}}>Search for your favourite GIFs!!!</Typography>
                    {/* if state search is true display gifs */}
                    {this.state.search ? 
                        (<div className="search">
                            <form onSubmit={this.handleSearch} style={{ width: "100%", paddingTop: "20px", textAlign: "center" }} autoComplete="off">
                                <FormControl style={{ width: "55%" }}>
                                    <div style={{ paddingBottom: "60px", width: "100%" }}>
                                        <InputLabel htmlFor="search" style={{ color: "#61dafb"}}>Search</InputLabel>
                                        <Input onChange={this.handleSearchTag} value={this.state.searchTag} style={{ width: "100%", color: "#61dafb"}}  type="text" id="searchTag"/>
                                    </div>
                                    <Button type="submit" style={{ color: "black", backgroundColor: "#61dafb" }} color="primary">Search</Button>  
                                </FormControl>
                            </form>
                            <div className="search-results">
                                {this.state.data.map((gif, index) => (
                                    <Paper key={gif.id} elevation={3} style={{ float: "left", width: "400px", height: "280px", backgroundColor: "#0e151c", padding: "35px"}}>
                                        <Card style={{ maxWidth: "365" }}> 
                                            <CardMedia style={{ height: "0", paddingTop: "56.25%" }} image={gif.images.fixed_height.url} title={gif.title} />            
                                            <CardActions disableSpacing style={{backgroundColor: "#61dafb"}}>
                                                <IconButton onClick={() => this.handleFavourite(gif.id)} id={gif.id} aria-label="add">
                                                    <FavoriteIcon />
                                                </IconButton>  
                                            </CardActions>
                                        </Card>
                                    </Paper>
                                
                                ))}
                            </div>
                        </div>)
                    :
                    /* if state search is false display empty box */
                        (<div className="search">
                            <form onSubmit={this.handleSearch} style={{ width: "100%", paddingTop: "20px", textAlign: "center" }} autoComplete="off">
                                <FormControl style={{ width: "55%" }}>
                                    <div style={{ paddingBottom: "60px", width: "100%" }}>
                                        <InputLabel  htmlFor="search" style={{ color: "#61dafb"}}>Search</InputLabel>
                                        <Input onChange={this.handleSearchTag} value={this.state.searchTag} style={{ width: "100%", color: "#61dafb"}} type="text" id="search"/>
                                    </div>
                                    <Button type="submit" style={{ color: "black", backgroundColor: "#61dafb" }} color="primary">Search</Button>  
                                </FormControl>
                            </form>
                            <div className="empty-search">
                                <Paper style={{ backgroundColor: "#0e151c" }} className="search-paper" elevation={24}>
                                    <Typography variant="h5" style={{height: "100%", color: "#61dafb", paddingTop: "25px", textAlign: "center"}}>Empty Search</Typography>
                                </Paper>
                            </div>
                        </div>)       
                    }           
                </div>
            </div>
                
        );
    }
}

export default Search;