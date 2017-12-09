const router = require("express").Router();

const authentication = require('./authentication');
const user = require('./user');


router.use('/authentication', authentication.authenticationController);
router.use('/user', user.userController);

module.exports = router;