const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Contains db connection and secret token for jwt
const config = require('config');
// Used down below - 'check'
const {check, validationResult} = require('express-validator');

// Want to use middleware
const auth = require('../../middleware/auth')

// Using 'User' model on await function below when returning user information - returned in form of 'User'
const User = require('../../models/User');


// @route       GET api/auth
// @desc        Test route
// @access      Public
// Use second parameter 'auth' to use the middleware -- the addition makes it PROTECTED
router.get('/', auth, async (req, res) => {
    try { // Find user information - password from User collection
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route       Post api/auth
// @desc        Authenticate user & get token
// @access      Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Called destructuring... so you don't have to type in req.body.email / etc...
    const {email, password} = req.body;

    try { // See if user exists
        let user = await User.findOne({email});
        if (! user) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Invalid Credentials'
                    }
                ]
            });
        }

        // First parameter 'password' is plain text password, second param 'user.password' is encrypted password returned from db
        const isMatch = await bcrypt.compare(password, user.password);

        if (! isMatch) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Invalid Credentials'
                    }
                ]
            });
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };
        // Token signed with time limit of 1 hour
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 3600
        }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({token});
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
