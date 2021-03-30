import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// creating a private routes so that non users cant access certain pages like search / account
// if a random user enters in a specfic gifo directory without being signed in they will be sent back to login
const PrivateRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				!!localStorage.getItem('userEmail') === true ? <Component {...props} /> : <Redirect to="/login" />}
		/>
	);
};

export default PrivateRoute;