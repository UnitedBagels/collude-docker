const express = require('express');
const router = express.Router();
// Used for profile avatars
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Contains db connection and secret token for jwt
const config = require('config');
// Used down below - 'check'
const {check, validationResult} = require('express-validator');

// Want to use middleware
const auth = require('../../middleware/auth');

// Bringing in the user model
const User = require('../../models/User');

// @route       Post api/users
// @desc        Register user
// @access      Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 9 or more characters').isLength(
        {min: 9}
    )
], async (req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Called destructuring... so you don't have to type in req.body.email / etc...
    const {name, email, password} = req.body;

    try { // See if user exists
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'User already exists'
                    }
                ]
            });
        }

        user = new User({name, email, password});

        // Encrypt password

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

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


// @route       Get api/users
// @desc        Get All Users
// @access      Public
// /api/user?search=username
//TODO: Add auth middleware here to ensure that same user is not returned when searching
router.get('/', auth, async (req, res) => {
    const searchKeyword = req.query.search ? {
        $or : [
            { name: { $regex: req.query.search, $options: 'i'} },
            { email: { $regex: req.query.search, $options: 'i'} }
        ],
    } : {};
    
    const users = await User.find(searchKeyword).find({_id: { $ne: req.user.id }});
    res.send(users);
});

module.exports = router;