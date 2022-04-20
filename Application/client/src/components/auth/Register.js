import React, { Fragment, useState } from 'react';
// We need this in order to use the store in a component
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
// Bringing in redux action
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { register } from '../../actions/auth';

import styles from './style/auth.module.css';

// Bring in all actions the component will use inside an object listed as a param
// Parameters of function should contain all props used and be reflected by the prop types listed below
const Register = ({ setAlert, register, isAuthenticated }) => {
	const [values, setValues] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});

	const { name, email, password, password2 } = values;

	// const onChange = (e) =>
	// setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleClickShowPassword = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		});
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== password2) {
			// Params as formed in alert.js from actions
			console.log('Passwords do not match');
			// TODO: Alert component goes here
		} else {
			register({ name, email, password });
		}
	};

	// If isAuthenticated is ever flagged True, redirect to the landing page
	if (isAuthenticated) {
		return <Navigate to='/dashboard' />;
	}

	return (
		<Fragment>
			<div className={styles.page}>
				<form
					id='signup'
					className={styles.form}
					onSubmit={(e) => onSubmit(e)}
				>
					<div
						className={`${styles.formWrapper} ${styles.formWrapperLogin}`}
					>
						<h1 className={styles.title}>Log In</h1>
						<FormControl
							variant='outlined'
							fullWidth
							className={styles.formItem}
						>
							<InputLabel htmlFor='outlined-adornment-name'>
								Name
							</InputLabel>
							<OutlinedInput
								id='outlined-adornment-name'
								value={name}
								onChange={handleChange('name')}
								label='Name'
							/>
						</FormControl>
						<FormControl
							variant='outlined'
							fullWidth
							className={styles.formItem}
						>
							<InputLabel htmlFor='outlined-adornment-email'>
								Email
							</InputLabel>
							<OutlinedInput
								id='outlined-adornment-email'
								value={email}
								onChange={handleChange('email')}
								label='Email'
							/>
						</FormControl>
						<FormControl
							variant='outlined'
							fullWidth
							className={styles.formItem}
						>
							<InputLabel htmlFor='outlined-adornment-password'>
								Password
							</InputLabel>
							<OutlinedInput
								id='outlined-adornment-password'
								type={values.showPassword ? 'text' : 'password'}
								value={password}
								onChange={handleChange('password')}
								endAdornment={
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={handleClickShowPassword}
											onMouseDown={
												handleMouseDownPassword
											}
											edge='end'
										>
											{values.showPassword ? (
												<VisibilityOff />
											) : (
												<Visibility />
											)}
										</IconButton>
									</InputAdornment>
								}
								label='Password'
							/>
						</FormControl>
						<FormControl
							variant='outlined'
							fullWidth
							className={styles.formItem}
						>
							<InputLabel htmlFor='outlined-adornment-password2'>
								Password
							</InputLabel>
							<OutlinedInput
								id='outlined-adornment-password'
								type={values.showPassword ? 'text' : 'password'}
								value={password2}
								onChange={handleChange('password2')}
								endAdornment={
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={handleClickShowPassword}
											onMouseDown={
												handleMouseDownPassword
											}
											edge='end'
										>
											{values.showPassword ? (
												<VisibilityOff />
											) : (
												<Visibility />
											)}
										</IconButton>
									</InputAdornment>
								}
								label='Password2'
							/>
						</FormControl>

						<input
							type='submit'
							className={styles.submit}
							value='Register'
						/>
					</div>
				</form>
			</div>
		</Fragment>
	);
};

// List all proptypes here for error checking
// This should contain all props used and be reflected by the function parameters that use them above
Register.propTypes = {
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

// use mapStateToProps when we want to pull a value from the state, in this case updating isAuthenticated
const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

// Need to export connect with the component itself
// export default connect()(Register);

// First parameter is any state that you want to map, second is an object with any actions you want to use with this component
export default connect(mapStateToProps, { register })(Register);
