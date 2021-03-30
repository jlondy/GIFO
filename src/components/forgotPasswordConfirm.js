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
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();

class ForgotPasswordConfirm extends Component {
    constructor() {
		super();
		this.state = {
            code: "", // users input
            errorMessage: "",
            emailSent: false,
            redirection: false
		};
		this.handleSendCode = this.handleSendCode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCodeCheck = this.handleCodeCheck.bind(this);
    }
    
    handleChange = (user) => {
		this.setState({
			code: user.target.value
		});
    };

    handleCodeCheck(e) {
        e.preventDefault();
        const self = this;
        
        if(this.state.code === localStorage.getItem('uuid')){
            localStorage.removeItem('uuid');
            self.setState({redirection: true});
        }   
        else{
            self.setState({errorMessage: "Invalid Code"})
        }  
    }

    handleSendCode(e) {
        e.preventDefault();
        const self = this;
       
        var AWS = require('aws-sdk');
        // AWS configuration
        AWS.config.update({
            region: process.env.REACT_APP_AWS_REGION,
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN
        });
        
        var uuid = uuidv4();
        localStorage.setItem('uuid', uuid);

        var params = {
            Message: 'Verification Code: ' + uuid,
            TopicArn: 'arn:aws:sns:us-east-1:998665822610:ForgotPassword'
        };
        
        var publishToUser = new AWS.SNS({apiVersion: '2010-03-31'});
        publishToUser.publish(params, (error, data) => {
            if(error){
                console.log(error);
            }
            else{
                console.log("published", data);
                var topicArn = { 
                    TopicArn : process.env.REACT_APP_AWS_TOPIC_ARN
                };
                var subList = new AWS.SNS({apiVersion: '2010-03-31'});
                subList.listSubscriptionsByTopic(topicArn, (error, data) => {
                    if(error){
                        console.log("error", error);
                    }
                    else{
                        console.log("sub list", data);
                        var subArn = { 
                            SubscriptionArn : data.Subscriptions[0].SubscriptionArn
                        };
                       
                        var unsubscribeUser = new AWS.SNS({apiVersion: '2010-03-31'});
                        unsubscribeUser.unsubscribe(subArn, (error, data) => {
                            if(error){
                                console.log("error", error);
                            }
                            else{
                                console.log("unsub", data);
                            }
                        });
                    }
                });

                
                self.setState({emailSent: true});
            }
        });
    }
   

  
  render() {
    // if users login was successful then go to search page
    if (this.state.redirection) {
      return <Redirect to="/updateUser" />;
    }
    return (
        <div>
            <Navigation />
            {this.state.emailSent ? 
                <div className="forgot-password">
                    <Paper style={{ backgroundColor: "#0e151c" }} className="forgot-password-paper" elevation={24} spacing={16}>
                        <Typography variant="h3" style={{ color: "white", paddingTop: "25px", textAlign: "center" }}>Enter in the verification code</Typography>
                        <form onSubmit={this.handleCodeCheck} style={{ width: "100%", paddingTop: "20px", textAlign: "center" }} autoComplete="off">
                            <FormControl style={{ width: "55%" }}>
                                <div style={{ paddingBottom: "60px", width: "100%" }}>
                                    <InputLabel htmlFor="code" style={{ color: "#61dafb"}}>Code</InputLabel>
                                    <Input value={this.state.code} onChange={this.handleChange} style={{ width: "100%", color: "#61dafb" }} placeholder="Code" type="text" id="Code"/>  
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
            :
                <div className="forgot-password">
                    <Paper style={{ backgroundColor: "#0e151c" }} className="forgot-password-paper" elevation={24} spacing={16}>
                        <Typography variant="h3" style={{ color: "white", paddingTop: "25px", textAlign: "center" }}>Click below to recieve verification code in your email!</Typography>
                        <form onSubmit={this.handleSendCode} style={{ width: "100%", paddingTop: "20px", textAlign: "center" }} autoComplete="off">
                            <FormControl style={{ width: "55%" }}>
                                <Button type="submit" style={{ color: "black", backgroundColor: "#61dafb" }} color="primary">Code</Button>  
                            </FormControl>
                        </form>
                    </Paper>
                </div>
            }
        </div>

    );
  }
}

export default ForgotPasswordConfirm;