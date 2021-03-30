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

require('dotenv').config();

class UpdateUser extends Component {
  constructor() {
    super();
    this.state = {
      password: "", // users input
      errorMessage: "",
      updated: false,
      redirection: false
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRedirection = this.handleRedirection.bind(this);
  }
  
  handleChange = (user) => {
    this.setState({
      [user.target.id]: user.target.value
    });
  };
  
  handleUpdate(e) {
    e.preventDefault();
    const self = this;
    const inputValidation = this.checkInputs(); 
    if(inputValidation){
      //TODO UPDATE USER IN DB HASH PASSWORD
      self.setState({updated: true}); 
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

  handleRedirection(e) {
    e.preventDefault();
    const self = this; 
     
    localStorage.setItem("userEmail", localStorage.getItem("updateUser")); 
    localStorage.removeItem("updateUser"); 
    self.setState({redirection: true});
  }
  
  render() {
    // if users login was successful then go to search page
    if (this.state.redirection) {
      return <Redirect to="/search" />;
    }
    return (
        <div>
            <Navigation />
            {this.state.updated ? 
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