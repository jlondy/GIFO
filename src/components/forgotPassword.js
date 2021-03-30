import React, { Component } from "react";
import "./styles/forgotPassword.css";
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Navigation from '../components/header';
import { Redirect } from "react-router-dom";
import axios from 'axios';

require('dotenv').config();

class ForgotPassword extends Component {
    constructor() {
		super();
		this.state = {
      email: "", // users input
      errorMessage: "",
      redirection: false
		};
		this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    }
    
    handleChange = (user) => {
      this.setState({
        [user.target.id]: user.target.value
      });
    };
    
    handleEmailSubmit(e) {
        e.preventDefault();
        localStorage.clear();
        const self = this;

        // send email through api gateway where lambda will check if email is in database
        axios.post('https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-get-user', 
        {
            "email": this.state.email
        })
        .then((res) => {
          // email exists 
          if(res.data.Items.length > 0){
            var AWS = require('aws-sdk');
            // AWS configuration
            AWS.config.update({
              region: process.env.REACT_APP_AWS_REGION,
              accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
              secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
              sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN
            });

            var params = {
              Protocol: 'email', 
              TopicArn: process.env.REACT_APP_AWS_TOPIC_ARN,
              Endpoint: self.state.email
            };
            
            var userSubcribing = new AWS.SNS({apiVersion: '2010-03-31'});
            userSubcribing.subscribe(params, (error, data) => {
              if(error){
                console.log(error);
              }
              else{
                console.log("sub", data);
                localStorage.setItem("updateUser", self.state.email);
                self.setState({redirection: true});
              }
            });
          }       
          // email does not exist
          else{
              this.setState({errorMessage: "Sorry! You aren't signed up in our system"});
          }
        })
        .catch((err) => {
            console.log("Forgot Password Error", err);
        });
        
  }
   

  
  render() {
    // if users login was successful then go to search page
    if (this.state.redirection) {
      return <Redirect to="/forgotPasswordConfirm" />;
  }
    return (
        <div>
            <Navigation />
            <div className="forgot-password">
                <Paper style={{ backgroundColor: "#0e151c" }} className="forgot-password-paper" elevation={24} spacing={16}>
                    <Typography variant="h3" style={{ color: "white", paddingTop: "25px", textAlign: "center" }}>Forgot Password</Typography>
                    <form onSubmit={this.handleEmailSubmit} style={{ width: "100%", paddingTop: "20px", textAlign: "center" }} autoComplete="off">
                        <FormControl style={{ width: "55%" }}>
                            
                            <div style={{ paddingBottom: "60px", width: "100%" }}>
                                <InputLabel htmlFor="email" style={{ color: "#61dafb"}}>Email</InputLabel>
                                <Input value={this.state.email} onChange={this.handleChange} style={{ width: "100%", color: "#61dafb" }} placeholder="Email" type="email" id="email"/>  
                            </div>
                            <div style={{ fontSize: "10px", color: "red" }}>
                              <Typography xs={12} gutterBottom style={{ textAlign: "center" }}>
                                {this.state.errorMessage}
                              </Typography>
                            </div>
                            <Button type="submit" style={{ color: "black", backgroundColor: "#61dafb" }} color="primary">Submit</Button>  
                        </FormControl>
                    </form>
                </Paper>
            </div>
        </div>

    );
  }
}

export default ForgotPassword;