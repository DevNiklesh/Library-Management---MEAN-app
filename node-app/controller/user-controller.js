const { ValidationResult, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');

const User = require('../schemas/user-schema');
const { generateHashedPassword, generateServerErrorCode } = require('../store/util');
const { config } = require('../config');

exports.createUser = (email, password, name) => {
    const data = { email, name, password };
    return new User(data).save();
};

function comparePassword(password, hashedPassword) {
    if(sha256(password) === hashedPassword) return true;
    else return false;
}

exports.register = async (req, res) => {
    try {
        const errosAfterValidation = validationResult(req);
        if(!errosAfterValidation.isEmpty()) {
            return res.status(400).json({
                code: 400,
                errors: errosAfterValidation.mapped()
            });
        }
        const { email, password, name } = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            await this.createUser(email, password, name);

            const newUser = await User.findOne({ email });
            const token = "Bearer " + jwt.sign({ email, name, sub: newUser.toJSON()._id }, config.passport.secret, {
                expiresIn: config.passport.expiresIn
            });

            const userToReturn = { ...newUser.toJSON(), ...{token} };
            delete userToReturn.password;

            res.status(200).json(userToReturn);
        } else {
            generateServerErrorCode(res, 403, 'register email error', "USER_ALREADY_EXIST", 'email');
        }
    } catch(e) {
        generateServerErrorCode(res, 500, e, "SOME_THING_WENT_WRONG");
    }
};

exports.login = async (req, res) => {
    try {
        const errosAfterValidation = validationResult(req);
        if(!errosAfterValidation.isEmpty()) {
            return res.status(400).json({
                code: 400,
                errors: errosAfterValidation.mapped()
            });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(user && user.email) {
            const isPasswordMatched = comparePassword(password, user.password);
            if(isPasswordMatched) {
                const token = "Bearer " + jwt.sign({ email, name: user.name, sub: user._id }, config.passport.secret, { expiresIn: config.passport.expiresIn });
                const userToReturn = { ...user.toJSON(), ...{token} };

                delete userToReturn.password;
                res.status(200).json(userToReturn);
            } else {
                generateServerErrorCode(res, 403, 'Login password error', "WRONG_PASSWORD", 'password');
            }
        } else {
            generateServerErrorCode(res, 404, 'login email error', "USER_DOES_NOT_EXIST", 'email');
        }
    } catch(e) {
        generateServerErrorCode(res, 500, e, "SOME_THING_WENT_WRONG");
    }
};

exports.getUserById = (req, res, next) => {
    try {
        if(req.user) {
            console.log(req.user);
            User.findOne({ _id: req.user._id }, (err, user) => {
                if(err) {
                    console.log(err)
                    next(err);
                } else if(!user) {
                    next("No user found for the id: " + req.params.id);
                    return;
                }
                res.send(user);
            });
        } else {
            next("Book Id not available")
        }
    } catch(error) {
        next(error);
    }
};