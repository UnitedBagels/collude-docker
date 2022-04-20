import React, { Fragment, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { login } from '../../actions/auth';

import styles from './style/auth.module.css';

// Parameters of function should contain all props used and be reflected by the prop types listed below
const Login = ({ login, isAuthenticated }) => {
	const [values, setValues] = useState({
		email: '',
		password: '',
		showPassword: false,
	});

	const { email, password } = values;

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
		login(email, password);
	};

	// If isAuthenticated is ever flagged True, redirect to the landing page
	if (isAuthenticated) {
		return <Navigate to='/dashboard' />;
	}

	return (
		<Fragment>
			<div className={styles.page}>
				<form
					id='login'
					onSubmit={(e) => onSubmit(e)}
					className={styles.form}
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

						<input
							type='submit'
							className={styles.submit}
							value='Login'
						/>
					</div>
				</form>
			</div>
		</Fragment>
	);
};

// List all proptypes here for error checking
// This should contain all props used and be reflected by the function parameters that use them above
Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

// use mapStateToProps when we want to pull a value from the state, in this case updating isAuthenticated
const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

// First parameter is any state that you want to map, second is an object with any actions you want to use with this component
export default connect(mapStateToProps, { login })(Login);
