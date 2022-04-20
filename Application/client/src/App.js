import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import LandingPage from './components/landing/LandingPage';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

import Dashboard from './components/dashboard/dash/Dashboard';
import Meetings from './components/dashboard/meeting/Meetings';
import Chat from './components/dashboard/chat/Chat';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import setAuthToken from './utils/setAuthToken';

import { loadUser } from './actions/auth';
import PrivateRoute from './components/routing/PrivateRoute';
import { getSelfAvailability } from './actions/availability';

import Sidebar from './components/layout/sideBar';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Sidebar />
					<Routes>
						{/* <Route path='/' element={<LandingPage />} /> */}
						<Route path='/' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route path='/login' element={<Login />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/chat' element={<Chat />} />
						<Route path='/meetings' element={<Meetings />} />
					</Routes>
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
