var express = require('express');
var router = express.Router();

import UserController from '../controllers/userController';
import ArticleController from '../controllers/articleController';
import identifyUser from '../middlewares/identifyUser';

const userController = new UserController();
const articleController = new ArticleController();

// auth
router.post('/signup', userController.addUser );
router.post('/signin', userController.login );
router.get('/allusers', userController.getUsers ); //dummy


// router.get('/articles', articleController.get );


module.exports = router;
