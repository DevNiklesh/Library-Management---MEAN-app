const sha256 = require('sha256');
const { check } = require('express-validator');

exports.generateHashedPassword = (password) => sha256(password);

exports.generateServerErrorCode = (res, code, fullError, msg, location = 'server') => {
    const errors = {};
    errors[location] = {
        fullError,
        msg
    };

    return res.status(code).json({
        code, fullError, errors
    });
};


exports.registerValidation = [
    check('email')
        .exists().withMessage("Email is empty")
        .isEmail().withMessage("Email is in wrong format"),
    check('password')
        .exists().withMessage("Password is empty")
        .isLength({ min: 6 }).withMessage("Password length must be more than 6"),
        
];

exports.loginValidation = [
    check('email')
        .exists().withMessage("Email is empty")
        .isEmail().withMessage("Email is in wrong format"),
    check('password')
        .exists().withMessage("Password is empty")
        .isLength({ min: 6 }).withMessage("Password length must be more than 6"),
        
];