var express = require('express');
var router = express.Router();

import UserController from '../controllers/userController';
import identifyUser from '../middlewares/identifyUser';

const userController = new UserController();

// auth
router.post('/signup', userController.addUser );
router.post('/signin', userController.login );


router.get('/allusers', userController.getUsers );


module.exports = router;
