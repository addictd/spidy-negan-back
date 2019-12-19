var express = require('express');
var router = express.Router();

import UserController from '../controllers/userController';
import ArticleController from '../controllers/articleController';
import UserActivityController from '../controllers/userActivityController';
import identifyUser from '../middlewares/identifyUser';

const userController = new UserController();
const articleController = new ArticleController();
const userActivityController = new UserActivityController();

// auth

router.get('*', (req, res, next) => {
    res.render('index.html');
});
router.post('/signup', userController.addUser);
router.post('/signin', userController.login);
router.get('/allusers', userController.getUsers); //dummy


router.get('/activity', identifyUser, userActivityController.get);



// router.post('/activity', identifyUser, userActivityController.set);


module.exports = router;
