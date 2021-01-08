const router = require("express").Router();
const userController = require("./controller/user-controller");
const bookController = require("./controller/book-controller");

const { registerValidation, loginValidation } = require('./store/util');
const passport = require("passport");

// User
router.post("/user/register", registerValidation, userController.register);
router.post("/user/login", loginValidation, userController.login);
router.get("/user", passport.authenticate('jwt', { session: false }), userController.getUserById);

// Book
router.post("/book/add", passport.authenticate('jwt', { session: false }), bookController.create);
router.delete("/book/del/:id", passport.authenticate('jwt', { session: false }), bookController.deleteById);
router.get("/book/:id", bookController.getOneBook);
router.get("/books", bookController.getAll);


module.exports = router;