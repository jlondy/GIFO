import React, { Component } from "react";
import "./styles/register.css";
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

class Register extends Component {
    constructor() {
		super();
		this.state = {
            username: "", // users input
			email: "", // users input
            password: "", // users input
            redirection: false, // page direction selector
            errorMessages: [] // error items
		};
		this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    // handle users input changes
    handleChange = (user) => {
		this.setState({
			[user.target.id]: user.target.value
		});
    };

    // check users inputs
    checkInputs = () => {
        let errors = ["", "", ""];
    
        // need atleast 1 character for the name
        if (this.state.username.length === 0) {
          errors[0] = "Required";
        }
        // email requires @
        if (!this.state.email.includes("@")) {
          errors[1] = "Email requires @";
        }
        // password must have more than 6 characters
        if (this.state.password.length < 6) {
          errors[2] = "Password requires atleast 6 characters";
        }
        // set error messages if any of the above are true
        if (errors[0] !== "" || errors[1] !== "" || errors[2] !== "") {
          this.setState({ errorMessages: errors });
          return false;
        }
        // return true if above statment is false
        return true;
    }

    // handle user registeration
    async handleRegister(e) {
        
        e.preventDefault();
        localStorage.clear();
        // check the users inputs
        const inputValidation = this.checkInputs(); 
        // if inputs are good then check if user exists
        if(inputValidation === true){
            const self = this;
            const { email, password } = this.state;
            // pass email in api gateway to lambda where lambda will then do the rest
            await axios.post(
            'https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-get-email',
            {           
                "email": email
            })
            .then((res) => {
                // if email does not exist in database
                if(res.data.Count === 0){
                    // hash the password
                    bcrypt.hash(password, 10, function(err, hash) {
                        // then send email and hash to lambda through api gateway which lambda will store in database
                        axios.post(
                            ' https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo',
                            {
                                "email": email,
                                "password": hash
                            })
                            .then((res) => {
                                // successfull create local storage with username and set redirection to true to switch pages
                                console.log("Registration Successful!");
                                localStorage.setItem("userEmail", email);   
                                self.setState({ redirection: true });
                            })
                            .catch((err) => {
                                // unsuccessful 
                                console.log(err);
                            }); 
                    });
                          
                }
                // email already exist
                else{
                    // set last error message
                    console.log("Email already exists");
                    this.setState({ errorMessages: ["", "", "", "Email already exists"]  });
                }
            })
            .catch((err) => {
                console.log("Registration Error", err);
            });
        }
        
    }

    render() {
        // if users registration was successful then go to search page
        if (this.state.redirection) {
            return <Redirect to="/search" />;
        }
        return (
            <div>
                <Navigation />
                <div className="register">
                    <Paper style={{ backgroundColor: "#0e151c" }} className="register-paper" elevation={24} spacing={16}>
                        <Typography variant="h3" style={{ color: "white", paddingTop: "25px", textAlign: "center" }}>Register</Typography>
                        <form onSubmit={this.handleRegister} style={{ width: "100%", paddingTop: "20px", textAlign: "center" }} autoComplete="off">
                            <FormControl style={{ width: "55%" }}>
                                <div style={{ paddingBottom: "60px", width: "100%" }}>
                                    <InputLabel htmlFor="username" style={{ color: "#61dafb"}}>Username</InputLabel>
                                    <Input value={this.state.username} onChange={this.handleChange} style={{ width: "100%", color: "#61dafb" }} placeholder="Username" type="text" id="username"/>  
                                </div>
                                <div style={{ fontSize: "10px", color: "red" }}>
									<Typography xs={12} gutterBottom style={{ textAlign: "center" }}>
										{this.state.errorMessages[0]}
									</Typography>
								</div>
                            </FormControl>
                            <FormControl style={{ width: "55%" }}>
                                <div style={{ paddingBottom: "60px", width: "100%" }}>
                                    <InputLabel htmlFor="email" style={{ color: "#61dafb"}}>Email</InputLabel>
                                    <Input value={this.state.email} onChange={this.handleChange} style={{ width: "100%", color: "#61dafb" }} placeholder="Email" type="email" id="email"/>  
                                </div>
                                <div style={{ fontSize: "10px", color: "red" }}>
									<Typography xs={12} gutterBottom style={{ textAlign: "center" }}>
										{this.state.errorMessages[1]}
									</Typography>
								</div>
                            </FormControl>
                            <FormControl style={{ width: "55%" }}>
                                <div style={{ paddingBottom: "60px", width: "100%" }}>
                                    <InputLabel htmlFor="password" style={{ color: "#61dafb"}}>Password</InputLabel>
                                    <Input value={this.state.password} onChange={this.handleChange} style={{ width: "100%", color: "#61dafb"}} placeholder="Password" type="password" id="password"/>
                                </div>
                                <div style={{ fontSize: "10px", color: "red" }}>
									<Typography xs={12} gutterBottom style={{ textAlign: "center" }}>
										{this.state.errorMessages[2]}
									</Typography>
								</div>
                                <div style={{ fontSize: "10px", color: "red" }}>
									<Typography xs={12} gutterBottom style={{ textAlign: "center" }}>
										{this.state.errorMessages[3]}
									</Typography>
								</div>
                                <Button type="submit" style={{ color: "black", backgroundColor: "#61dafb" }} color="primary">Register</Button>  
                            </FormControl>
                        </form>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default Register;