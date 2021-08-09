var express = require('express');
var router = express.Router();
var User = require('./User.Controller');
const validator = require("./validator");
 
router.post('/', function(req, res, next) {
    res.status(200).send('Hello v1.0 POST API');
});

router.post('/UserLogin', User.UserLogin);
router.post('/UserRegistration', validator.UserRegistration,  User.UserRegistration);
router.post('/UserDelete',  User.UserDelete);
router.post('/UserList',  User.UserList);
router.post('/GetState',  User.GetState);
router.post('/GetCity',  User.GetCity);

router.post('/CovidQueList',  User.CovidQueList);
router.post('/CovidTestEntry',  User.CovidTestEntry);
router.post('/CovidAnsEntry',  User.CovidAnsEntry);

module.exports = router;