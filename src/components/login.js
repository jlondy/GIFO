import React, { Component } from "react";
import "./styles/login.css";
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import { Redirect } from "react-router-dom";
import Navigation from '../components/header';

const bcrypt = require("bcryptjs");

class Login extends Component {
    constructor() {
		super();
		this.state = {
			email: "", // users input
            password: "", // users input
            redirection: false, // page direction selector
            errorMessage: "" // error item
		};
		this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        localStorage.clear();
    }

    // handle users input changes
    handleChange = (user) => {
		this.setState({
			[user.target.id]: user.target.value
		});
    };
    
    // handle user login
    async handleLogin(e) {
        e.preventDefault();
        localStorage.clear();
        const self = this;
        const { email, password } = this.state;
        
        // send email through api gateway where lambda will check if email is in database
        await axios.post('https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-get-user', 
        {
            "email": email
        })
        .then((res) => {
            // email exists so compare password input with password in database
            if(res.data.Items.length > 0){
               
                // using input password with database hash to check if match
                bcrypt.compare(password, res.data.Items[0].Password, (err, result) => {
                    // if error exists return incorrect
                    if (err) {
                        self.setState({errorMessage: "Incorrect email and password"});
                    }
                    // if result exists return correct
                    if (result) {
                        localStorage.setItem("userEmail", email);
                        self.setState({ redirection: true });
                    }
                     // neither error or result happened so still return incorrect
                    else{
                        self.setState({errorMessage: "Incorrect email and password"});
                    }              
                });
            }       
            // email does not exist
            else{
                this.setState({errorMessage: "Incorrect email and password"});
            }
        })
        .catch((err) => {
            console.log("Login Error", err);
        });     
    }
     
    render() {
        // if users login was successful then go to search page
        if (this.state.redirection) {
            return <Redirect to="/search" />;
        }
        return (
            <div>
                <Navigation />
                <div className="login">
                    <Paper style={{ backgroundColor: "#0e151c" }} className="login-paper" elevation={24} spacing={16}>
                        <Typography variant="h3" style={{ color: "white", paddingTop: "25px", textAlign: "center" }}>Login</Typography>
                        <form onSubmit={this.handleLogin} style={{ width: "100%", paddingTop: "20px", textAlign: "center" }} autoComplete="off">
                            <FormControl style={{ width: "55%" }}>
                                <div style={{ paddingBottom: "60px", width: "100%" }}>
                                    <InputLabel htmlFor="email" style={{ color: "#61dafb"}}>Email</InputLabel>
                                    <Input value={this.state.email} onChange={this.handleChange} style={{ width: "100%", color: "#61dafb" }} placeholder="Email" type="email" id="email"/>  
                                </div>
                            </FormControl>
                            <FormControl style={{ width: "55%" }}>
                                <div style={{ paddingBottom: "60px", width: "100%" }}>
                                    <InputLabel htmlFor="password" style={{ color: "#61dafb"}}>Password</InputLabel>
                                    <Input value={this.state.password} onChange={this.handleChange}  style={{ width: "100%", color: "#61dafb"}} placeholder="Password" type="password" id="password"/>
                                </div>
                                <div style={{ fontSize: "10px", color: "red" }}>
									<Typography xs={12} gutterBottom style={{ textAlign: "center" }}>
										{this.state.errorMessage}
									</Typography>
								</div>
                                <Button type="submit" style={{ color: "black", backgroundColor: "#61dafb" }} color="primary">Sign In</Button>  
                            </FormControl>
                            <Typography xs={12} gutterBottom style={{color: "white", paddingTop: "40px", textAlign: "center"}}>
                                <a href="forgotPassword" style={{ color: "#61dafb" }}>Forgot password?</a>
                            </Typography>
                        </form>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default Login;