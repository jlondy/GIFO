import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom';

class Navigation extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout = () => {
		localStorage.clear();
	};
    
    render() {
        return(  
            <div>
                {localStorage.getItem("userEmail") ? (
                    <React.Fragment>
                        <AppBar position="fixed" style={{backgroundColor: "transparent"}} elevation={0}>
                            <Toolbar>
                                <div style={{flexGrow: "3", borderRadius: "16px"}}>         
                                    <Button color="inherit" component={Link} to="/search">
                                        <Typography variant="h4">GIFO</Typography>
                                    </Button>  
                                </div>
                                <div>
                                    <Button color="inherit" component={Link} to="/account" style={{marginRight: "16px", borderRadius: "16px", color: "black", backgroundColor: "#61dafb"}}>Account</Button>
                                    <Button onClick={this.handleLogout} color="inherit" component={Link} to="/login" style={{borderRadius: "16px", color: "black", backgroundColor: "#61dafb"}}>Logout</Button>
                                </div>
                            </Toolbar>
                        </AppBar>  
                    </React.Fragment> )
                : (
                    <React.Fragment>
                        <AppBar position="fixed" style={{backgroundColor: "transparent"}} elevation={0}>
                            <Toolbar>
                                <div style={{flexGrow: "3", borderRadius: "16px"}}>         
                                    <Button color="inherit" component={Link} to="/login">
                                        <Typography variant="h4">GIFO</Typography>
                                    </Button>  
                                </div>
                                <div>
                                    <Button color="inherit" component={Link} to="/login" style={{marginRight: "16px", borderRadius: "16px", color: "black", backgroundColor: "#61dafb"}}>Login</Button>
                                    <Button color="inherit" component={Link} to="/register" style={{borderRadius: "16px", color: "black", backgroundColor: "#61dafb"}}>Register</Button>        
                                </div>
                            </Toolbar>
                        </AppBar>  
                    </React.Fragment> )
                }
            </div>
        );      
    }
}
 
export default Navigation;