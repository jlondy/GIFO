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

const bcrypt = require("bcryptjs");

require('dotenv').config();

class UpdateUser extends Component {
  constructor() {
    super();
    this.state = {
      password: "", // users input
      errorMessage: "", // error message for password length
      updated: false, // checking if user is updated
      redirection: false // checking if page should switch
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRedirection = this.handleRedirection.bind(this);
  }
  
  // handle user input changes
  handleChange = (user) => {
    this.setState({
      [user.target.id]: user.target.value
    });
  };
  
  // handle user update
  handleUpdate(e) {
    e.preventDefault();
    const self = this;
    // checking is password is > 6 characters
    const inputValidation = this.checkInputs(); 
    // password is valid 
    if(inputValidation){
      // run through api gateway to lambda to get user email and password in database
      axios.post('https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-get-user', 
      {
          "email": localStorage.getItem("updateUser")
      })
      .then((res) => {
          // item is in database
          if(res.data.Items.length > 0){
            // delete users account
            axios.post('https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo-delete-user', 
            {
                "email": localStorage.getItem("updateUser"),
                "password": res.data.Items[0].Password
            })
            .then((res) => {
                console.log("Successfully deleted");
            })
            .catch((err) => {
                console.log("User Delete Error", err);
            });

            // hash the new password 
            bcrypt.hash(self.state.password, 10, function(err, hash) {
              // then send the new email and hash to lambda through api gateway which lambda will store in database
              axios.post(
              ' https://6t35dobcna.execute-api.us-east-1.amazonaws.com/dev/api-lambda-dynamo',
              {
                  "email": localStorage.getItem("updateUser"),
                  "password": hash
              })
              .then((res) => {
                  // successfull created and set updated to true to switch pages
                  console.log("Updated Successful!");
                  
                  self.setState({updated: true}); 
              })
              .catch((err) => {
                  // unsuccessful 
                  console.log(err);
              });
            });
          }            
        })
      .catch((err) => {
          console.log("Login Error", err);
      }); 
    } 

  }
  // check users inputs
  checkInputs = () => {
    // password must have more than 6 characters
    if (this.state.password.length < 6) {
      this.setState({errorMessage: "Password requires atleast 6 characters"})
      return false;
    }
    // return true if above statment is false
    return true;
  }

  // handle final confirmation
  handleRedirection(e) {
    e.preventDefault();
    const self = this; 
    // setting userEmail storage and remvoung updatedUser storage
    localStorage.setItem("userEmail", localStorage.getItem("updateUser")); 
    localStorage.removeItem("updateUser");
    // redirect to search page 
    self.setState({redirection: true});
  }
  
  render() {
    if (this.state.redirection) {
      return <Redirect to="/search" />;
    }
    return (
        <div>
            <Navigation />
            {this.state.updated ? 
            /* final confirmation screen */ 
              <div className="forgot-password">
                <Paper style={{ backgroundColor: "#0e151c" }} className="forgot-password-paper" elevation={24} spacing={16}>
                    <Typography variant="h3" style={{ color: "white", paddingTop: "25px", textAlign: "center" }}>Successfully updated! Continue searching for Gifs!</Typography>
                    <form onSubmit={this.handleRedirection} style={{ width: "100%", paddingTop: "20px", textAlign: "center" }} autoComplete="off">
                        <FormControl style={{ width: "55%" }}>
                            <Button type="submit" style={{ color: "black", backgroundColor: "#61dafb" }} color="primary">Search</Button>  
                        </FormControl>
                    </form>
                </Paper>
              </div>
            :
            /* password update screen */ 
            <div className="forgot-password">
              <Paper style={{ backgroundColor: "#0e151c" }} className="forgot-password-paper" elevation={24} spacing={16}>
                  <Typography variant="h3" style={{ color: "white", paddingTop: "25px", textAlign: "center" }}>Update Account Password</Typography>
                  <form onSubmit={this.handleUpdate} style={{ width: "100%", paddingTop: "20px", textAlign: "center" }} autoComplete="off">
                      <FormControl style={{ width: "55%" }}>
                          
                          <div style={{ paddingBottom: "60px", width: "100%" }}>
                              <InputLabel htmlFor="password" style={{ color: "#61dafb"}}>Update Password</InputLabel>
                              <Input value={this.state.password} onChange={this.handleChange} style={{ width: "100%", color: "#61dafb" }} placeholder="Update Password" type="password" id="password"/>  
                          </div>
                          <div style={{ fontSize: "10px", color: "red" }}>
                            <Typography xs={12} gutterBottom style={{ textAlign: "center" }}>
                              {this.state.errorMessage}
                            </Typography>
                          </div>
                          <Button type="submit" style={{ color: "black", backgroundColor: "#61dafb" }} color="primary">Update</Button>  
                      </FormControl>
                  </form>
              </Paper>
            </div>
            }
        </div>

    );
  }
}

export default UpdateUser;