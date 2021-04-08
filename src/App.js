import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Account from './components/account';
import Search from './components/search';
import Login from './components/login';
import Register from './components/register';
import ForgotPassword from './components/forgotPassword';
import ForgotPasswordConfirm from './components/forgotPasswordConfirm';
import UpdateUser from './components/updateUser';
import React from 'react';
import PrivateRoute from './utils/PrivateRoute';
import UpdateRoute from './utils/UpdateRoute';

function App() {

  return (

    <Router> 
        <Switch>
          
          {/* Open routes */}
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgotPassword" component={ForgotPassword} />
          
          {/* Updating user from forgot password routes */}
          <UpdateRoute path="/forgotPasswordConfirm" component={ForgotPasswordConfirm} />
          <UpdateRoute path="/updateUser" component={UpdateUser} />

          {/* Routes for users */}
          <PrivateRoute path="/search" component={Search} />
          <PrivateRoute path="/account" component={Account} />

        </Switch>
    </Router>
  );
}

export default App;
